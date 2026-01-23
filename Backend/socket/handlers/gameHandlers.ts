import { Server as SocketIOServer, Socket } from "socket.io";
import Game from "../../models/game.model.js";
import User from "../../models/user.models.js";
import { getRandomWordOptions } from "../../data/wordLists.js";
import type {
  GameRole,
  GameStatus,
  TokenType,
  IGame,
} from "../../types/index.js";

// Track which game room each socket is in
const socketGameMap: Record<string, string> = {};

// Get socket IDs for all players in a game
const getGameSocketIds = (
  gameCode: string,
  userSocketMap: Record<string, string>
): string[] => {
  const socketIds: string[] = [];
  for (const [socketId, code] of Object.entries(socketGameMap)) {
    if (code === gameCode) {
      socketIds.push(socketId);
    }
  }
  return socketIds;
};

// Helper to get public game state (without sensitive info)
const getPublicGameState = (game: IGame, userId?: string) => {
  const player = game.players.find(
    (p) => p.user.toString() === userId?.toString()
  );

  return {
    _id: game._id,
    code: game.code,
    host: game.host,
    players: game.players.map((p) => ({
      user: p.user,
      isConnected: p.isConnected,
      // Only reveal role to the player themselves, or after game ends
      role: game.status === "ended" || p.user.toString() === userId?.toString()
        ? p.role
        : null,
    })),
    status: game.status,
    // Only reveal magic word to appropriate roles or after game ends
    magicWord: shouldRevealWord(game, player?.role, game.status)
      ? game.magicWord
      : null,
    wordOptions: player?.role === "mayor" && game.status === "night"
      ? game.wordOptions
      : [],
    tokens: game.tokens,
    tokensUsed: game.tokensUsed,
    questions: game.questions,
    wordGuessed: game.wordGuessed,
    guessedBy: game.guessedBy,
    votes: game.votes,
    voteType: game.voteType,
    winner: game.winner,
    settings: game.settings,
    dayStartTime: game.dayStartTime,
  };
};

// Determine if the magic word should be revealed
const shouldRevealWord = (
  game: IGame,
  role: GameRole | null | undefined,
  status: GameStatus
): boolean => {
  if (status === "ended") return true;
  if (!role) return false;
  if (role === "mayor" && game.magicWord) return true;
  if ((role === "seer" || role === "werewolf") && game.magicWord) return true;
  return false;
};

// Assign roles based on player count
const assignRoles = (playerCount: number): GameRole[] => {
  const roles: GameRole[] = ["mayor", "seer", "werewolf"];

  // Add werewolves based on player count
  if (playerCount >= 7) {
    roles.push("werewolf");
  }

  // Fill remaining with villagers
  while (roles.length < playerCount) {
    roles.push("villager");
  }

  // Shuffle roles
  return roles.sort(() => Math.random() - 0.5);
};

export const setupGameHandlers = (
  io: SocketIOServer,
  socket: Socket,
  userSocketMap: Record<string, string>
) => {
  const userId = socket.handshake.query.userId as string;

  // Join a game room
  socket.on("game:join", async (data: { gameCode: string }) => {
    try {
      const { gameCode } = data;
      const game = await Game.findOne({ code: gameCode.toUpperCase() });

      if (!game) {
        socket.emit("game:error", { message: "Game not found" });
        return;
      }

      // Check if player is already in the game
      const existingPlayer = game.players.find(
        (p) => p.user.toString() === userId
      );

      if (!existingPlayer && game.status !== "lobby") {
        socket.emit("game:error", { message: "Game already started" });
        return;
      }

      // Join the socket room
      socket.join(gameCode.toUpperCase());
      socketGameMap[socket.id] = gameCode.toUpperCase();

      // Update player connection status
      if (existingPlayer) {
        existingPlayer.isConnected = true;
        await game.save();
      }

      // Notify all players in the room
      const populatedGame = await Game.findById(game._id)
        .populate("players.user", "fullName username profilePic")
        .populate("host", "fullName username profilePic");

      io.to(gameCode.toUpperCase()).emit("game:playerJoined", {
        game: getPublicGameState(populatedGame!, userId),
      });

      // Send personal game state to the joining player
      socket.emit("game:state", {
        game: getPublicGameState(populatedGame!, userId),
      });
    } catch (error) {
      console.error("Error joining game:", error);
      socket.emit("game:error", { message: "Failed to join game" });
    }
  });

  // Leave a game room
  socket.on("game:leave", async (data: { gameCode: string }) => {
    try {
      const { gameCode } = data;
      socket.leave(gameCode.toUpperCase());
      delete socketGameMap[socket.id];

      const game = await Game.findOne({ code: gameCode.toUpperCase() });
      if (game) {
        const player = game.players.find(
          (p) => p.user.toString() === userId
        );
        if (player) {
          player.isConnected = false;
          await game.save();
        }

        io.to(gameCode.toUpperCase()).emit("game:playerLeft", {
          userId,
          game: getPublicGameState(game, userId),
        });
      }
    } catch (error) {
      console.error("Error leaving game:", error);
    }
  });

  // Start the game (host only)
  socket.on("game:start", async (data: { gameCode: string }) => {
    try {
      const { gameCode } = data;
      const game = await Game.findOne({ code: gameCode.toUpperCase() });

      if (!game) {
        socket.emit("game:error", { message: "Game not found" });
        return;
      }

      if (game.host.toString() !== userId) {
        socket.emit("game:error", { message: "Only host can start the game" });
        return;
      }

      if (game.players.length < 4) {
        socket.emit("game:error", { message: "Need at least 4 players" });
        return;
      }

      if (game.status !== "lobby") {
        socket.emit("game:error", { message: "Game already started" });
        return;
      }

      // Assign roles
      const roles = assignRoles(game.players.length);
      game.players.forEach((player, index) => {
        player.role = roles[index];
      });

      // Generate word options for mayor
      const wordOptions = getRandomWordOptions(
        5,
        game.settings.wordCategory,
        game.settings.difficulty
      );
      game.wordOptions = wordOptions;

      // Set tokens from settings
      game.tokens = { ...game.settings.tokenCounts };

      // Transition to night phase
      game.status = "night";
      await game.save();

      const populatedGame = await Game.findById(game._id)
        .populate("players.user", "fullName username profilePic")
        .populate("host", "fullName username profilePic");

      // Notify all players with their personal game state
      for (const player of game.players) {
        const playerSocketId = userSocketMap[player.user.toString()];
        if (playerSocketId) {
          io.to(playerSocketId).emit("game:started", {
            game: getPublicGameState(populatedGame!, player.user.toString()),
            role: player.role,
          });
        }
      }
    } catch (error) {
      console.error("Error starting game:", error);
      socket.emit("game:error", { message: "Failed to start game" });
    }
  });

  // Mayor selects magic word
  socket.on(
    "game:selectWord",
    async (data: { gameCode: string; word: string }) => {
      try {
        const { gameCode, word } = data;
        const game = await Game.findOne({ code: gameCode.toUpperCase() });

        if (!game) {
          socket.emit("game:error", { message: "Game not found" });
          return;
        }

        const player = game.players.find(
          (p) => p.user.toString() === userId
        );

        if (!player || player.role !== "mayor") {
          socket.emit("game:error", { message: "Only mayor can select word" });
          return;
        }

        if (!game.wordOptions.includes(word)) {
          socket.emit("game:error", { message: "Invalid word selection" });
          return;
        }

        game.magicWord = word;
        game.status = "day";
        game.dayStartTime = new Date();
        await game.save();

        const populatedGame = await Game.findById(game._id)
          .populate("players.user", "fullName username profilePic")
          .populate("host", "fullName username profilePic");

        // Notify all players with their personal game state
        for (const p of game.players) {
          const playerSocketId = userSocketMap[p.user.toString()];
          if (playerSocketId) {
            io.to(playerSocketId).emit("game:dayStart", {
              game: getPublicGameState(populatedGame!, p.user.toString()),
              dayDuration: game.settings.dayDuration,
            });
          }
        }
      } catch (error) {
        console.error("Error selecting word:", error);
        socket.emit("game:error", { message: "Failed to select word" });
      }
    }
  );

  // Player asks a question
  socket.on(
    "game:question",
    async (data: { gameCode: string; text: string }) => {
      try {
        const { gameCode, text } = data;
        const game = await Game.findOne({ code: gameCode.toUpperCase() });

        if (!game || game.status !== "day") {
          socket.emit("game:error", { message: "Cannot ask questions now" });
          return;
        }

        const player = game.players.find(
          (p) => p.user.toString() === userId
        );

        if (!player) {
          socket.emit("game:error", { message: "You are not in this game" });
          return;
        }

        // Check if this is a guess (exact word match)
        const isGuess =
          text.toLowerCase().trim() === game.magicWord?.toLowerCase().trim();

        const question = {
          playerId: player.user,
          text,
          response: null,
          isGuess,
          timestamp: new Date(),
        };

        game.questions.push(question);

        // If word was guessed correctly
        if (isGuess) {
          game.wordGuessed = true;
          game.guessedBy = player.user;
          game.status = "voting";
          game.voteType = "findSeer";
          await game.save();

          const populatedGame = await Game.findById(game._id)
            .populate("players.user", "fullName username profilePic")
            .populate("host", "fullName username profilePic")
            .populate("questions.playerId", "fullName username profilePic");

          io.to(gameCode.toUpperCase()).emit("game:wordGuessed", {
            guessedBy: player.user,
            word: game.magicWord,
          });

          // Notify for voting phase
          for (const p of game.players) {
            const playerSocketId = userSocketMap[p.user.toString()];
            if (playerSocketId) {
              io.to(playerSocketId).emit("game:votingStart", {
                game: getPublicGameState(populatedGame!, p.user.toString()),
                voteType: "findSeer",
              });
            }
          }
        } else {
          await game.save();

          const populatedGame = await Game.findById(game._id)
            .populate("players.user", "fullName username profilePic")
            .populate("host", "fullName username profilePic")
            .populate("questions.playerId", "fullName username profilePic");

          io.to(gameCode.toUpperCase()).emit("game:newQuestion", {
            question: {
              ...question,
              playerId: await User.findById(player.user).select(
                "fullName username profilePic"
              ),
            },
            questionIndex: game.questions.length - 1,
          });
        }
      } catch (error) {
        console.error("Error asking question:", error);
        socket.emit("game:error", { message: "Failed to ask question" });
      }
    }
  );

  // Mayor responds with token
  socket.on(
    "game:mayorResponse",
    async (data: { gameCode: string; questionIndex: number; token: TokenType }) => {
      try {
        const { gameCode, questionIndex, token } = data;
        const game = await Game.findOne({ code: gameCode.toUpperCase() });

        if (!game || game.status !== "day") {
          socket.emit("game:error", { message: "Cannot respond now" });
          return;
        }

        const player = game.players.find(
          (p) => p.user.toString() === userId
        );

        if (!player || player.role !== "mayor") {
          socket.emit("game:error", { message: "Only mayor can respond" });
          return;
        }

        // Check if token is available
        if (game.tokens[token] <= 0) {
          socket.emit("game:error", { message: "No more tokens of this type" });
          return;
        }

        // Apply response
        game.questions[questionIndex].response = token;
        game.tokens[token] -= 1;
        game.tokensUsed.push({
          questionIndex,
          token,
          timestamp: new Date(),
        });

        await game.save();

        const populatedGame = await Game.findById(game._id)
          .populate("players.user", "fullName username profilePic")
          .populate("host", "fullName username profilePic")
          .populate("questions.playerId", "fullName username profilePic");

        io.to(gameCode.toUpperCase()).emit("game:tokenResponse", {
          questionIndex,
          token,
          remainingTokens: game.tokens,
        });
      } catch (error) {
        console.error("Error responding:", error);
        socket.emit("game:error", { message: "Failed to respond" });
      }
    }
  );

  // Time runs out
  socket.on("game:timeUp", async (data: { gameCode: string }) => {
    try {
      const { gameCode } = data;
      const game = await Game.findOne({ code: gameCode.toUpperCase() });

      if (!game || game.status !== "day") {
        return;
      }

      // Only host can trigger time up (to prevent multiple triggers)
      if (game.host.toString() !== userId) {
        return;
      }

      game.status = "voting";
      game.voteType = "findWerewolf";
      await game.save();

      const populatedGame = await Game.findById(game._id)
        .populate("players.user", "fullName username profilePic")
        .populate("host", "fullName username profilePic");

      for (const p of game.players) {
        const playerSocketId = userSocketMap[p.user.toString()];
        if (playerSocketId) {
          io.to(playerSocketId).emit("game:votingStart", {
            game: getPublicGameState(populatedGame!, p.user.toString()),
            voteType: "findWerewolf",
          });
        }
      }
    } catch (error) {
      console.error("Error handling time up:", error);
    }
  });

  // Player votes
  socket.on(
    "game:vote",
    async (data: { gameCode: string; targetId: string }) => {
      try {
        const { gameCode, targetId } = data;
        const game = await Game.findOne({ code: gameCode.toUpperCase() });

        if (!game || game.status !== "voting") {
          socket.emit("game:error", { message: "Cannot vote now" });
          return;
        }

        const player = game.players.find(
          (p) => p.user.toString() === userId
        );

        if (!player) {
          socket.emit("game:error", { message: "You are not in this game" });
          return;
        }

        // Check if player can vote
        // In findSeer mode, only werewolves vote
        // In findWerewolf mode, all non-werewolves vote
        const canVote =
          (game.voteType === "findSeer" && player.role === "werewolf") ||
          (game.voteType === "findWerewolf" && player.role !== "werewolf");

        if (!canVote) {
          socket.emit("game:error", { message: "You cannot vote" });
          return;
        }

        // Check if already voted
        const existingVote = game.votes.find(
          (v) => v.voterId.toString() === userId
        );

        if (existingVote) {
          // Update vote
          existingVote.targetId = new (require("mongoose").Types.ObjectId)(targetId);
          existingVote.timestamp = new Date();
        } else {
          game.votes.push({
            voterId: player.user,
            targetId: new (require("mongoose").Types.ObjectId)(targetId),
            timestamp: new Date(),
          });
        }

        await game.save();

        // Count total eligible voters
        const eligibleVoters = game.players.filter((p) =>
          game.voteType === "findSeer"
            ? p.role === "werewolf"
            : p.role !== "werewolf"
        );

        // Check if all eligible voters have voted
        if (game.votes.length >= eligibleVoters.length) {
          // Calculate result
          const voteCounts: Record<string, number> = {};
          for (const vote of game.votes) {
            const target = vote.targetId.toString();
            voteCounts[target] = (voteCounts[target] || 0) + 1;
          }

          // Find highest vote count
          let maxVotes = 0;
          let eliminated: string | null = null;
          for (const [targetId, count] of Object.entries(voteCounts)) {
            if (count > maxVotes) {
              maxVotes = count;
              eliminated = targetId;
            }
          }

          // Determine winner
          const eliminatedPlayer = game.players.find(
            (p) => p.user.toString() === eliminated
          );

          let winner: "village" | "werewolf";

          if (game.voteType === "findSeer") {
            // Werewolves were voting to find Seer
            // Village wins if they DON'T find Seer
            winner = eliminatedPlayer?.role === "seer" ? "werewolf" : "village";
          } else {
            // Village was voting to find Werewolf
            // Village wins if they find a Werewolf
            winner = eliminatedPlayer?.role === "werewolf" ? "village" : "werewolf";
          }

          game.winner = winner;
          game.status = "ended";
          await game.save();

          const populatedGame = await Game.findById(game._id)
            .populate("players.user", "fullName username profilePic")
            .populate("host", "fullName username profilePic");

          io.to(gameCode.toUpperCase()).emit("game:gameOver", {
            winner,
            game: getPublicGameState(populatedGame!, undefined), // All roles visible
            eliminated: eliminatedPlayer?.user,
            voteCounts,
          });
        } else {
          // Just notify that a vote was cast
          io.to(gameCode.toUpperCase()).emit("game:voteCast", {
            voterId: userId,
            votesCount: game.votes.length,
            totalVoters: eligibleVoters.length,
          });
        }
      } catch (error) {
        console.error("Error voting:", error);
        socket.emit("game:error", { message: "Failed to vote" });
      }
    }
  );

  // Handle disconnect for game
  socket.on("disconnect", async () => {
    const gameCode = socketGameMap[socket.id];
    if (gameCode) {
      delete socketGameMap[socket.id];

      const game = await Game.findOne({ code: gameCode });
      if (game) {
        const player = game.players.find(
          (p) => p.user.toString() === userId
        );
        if (player) {
          player.isConnected = false;
          await game.save();

          io.to(gameCode).emit("game:playerDisconnected", {
            userId,
            game: getPublicGameState(game, undefined),
          });
        }
      }
    }
  });
};

export { socketGameMap };
