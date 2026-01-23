import { Response } from "express";
import Game from "../models/game.model.js";
import { getRandomWordOptions, getCategories } from "../data/wordLists.js";
import type {
  AuthenticatedRequest,
  CreateGameBody,
  JoinGameBody,
  GameSettings,
} from "../types/index.js";

// Generate a random 4-letter room code
const generateRoomCode = (): string => {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let code = "";
  for (let i = 0; i < 4; i++) {
    code += letters.charAt(Math.floor(Math.random() * letters.length));
  }
  return code;
};

// Generate unique room code
const generateUniqueRoomCode = async (): Promise<string> => {
  let code: string;
  let attempts = 0;
  const maxAttempts = 100;

  do {
    code = generateRoomCode();
    const existingGame = await Game.findOne({
      code,
      status: { $ne: "ended" },
    });
    if (!existingGame) {
      return code;
    }
    attempts++;
  } while (attempts < maxAttempts);

  throw new Error("Could not generate unique room code");
};

// Create a new game
export const createGame = async (
  req: AuthenticatedRequest & { body: CreateGameBody },
  res: Response
): Promise<void> => {
  try {
    const userId = req.user!._id;
    const { settings } = req.body;

    // Generate unique room code
    const code = await generateUniqueRoomCode();

    // Default settings
    const defaultSettings: GameSettings = {
      dayDuration: 240,
      tokenCounts: {
        yes: 10,
        no: 10,
        maybe: 3,
        soClose: 1,
      },
      wordCategory: "general",
      difficulty: "medium",
    };

    // Merge with provided settings
    const gameSettings = { ...defaultSettings, ...settings };

    const game = new Game({
      code,
      host: userId,
      players: [
        {
          user: userId,
          role: null,
          isConnected: true,
        },
      ],
      settings: gameSettings,
      tokens: gameSettings.tokenCounts,
    });

    await game.save();

    const populatedGame = await Game.findById(game._id)
      .populate("players.user", "fullName username profilePic")
      .populate("host", "fullName username profilePic");

    res.status(201).json({
      message: "Game created successfully",
      game: populatedGame,
    });
  } catch (error) {
    if (error instanceof Error) {
      console.log("Error in createGame controller:", error.message);
    }
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Join an existing game
export const joinGame = async (
  req: AuthenticatedRequest & { body: JoinGameBody },
  res: Response
): Promise<void> => {
  try {
    const userId = req.user!._id;
    const { code } = req.body;

    const game = await Game.findOne({ code: code.toUpperCase() });

    if (!game) {
      res.status(404).json({ error: "Game not found" });
      return;
    }

    if (game.status !== "lobby") {
      res.status(400).json({ error: "Game has already started" });
      return;
    }

    // Check if player is already in the game
    const existingPlayer = game.players.find(
      (p) => p.user.toString() === userId.toString()
    );

    if (existingPlayer) {
      existingPlayer.isConnected = true;
    } else {
      // Add player to the game
      game.players.push({
        user: userId,
        role: null,
        isConnected: true,
      });
    }

    await game.save();

    const populatedGame = await Game.findById(game._id)
      .populate("players.user", "fullName username profilePic")
      .populate("host", "fullName username profilePic");

    res.status(200).json({
      message: "Joined game successfully",
      game: populatedGame,
    });
  } catch (error) {
    if (error instanceof Error) {
      console.log("Error in joinGame controller:", error.message);
    }
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get game by code
export const getGame = async (
  req: AuthenticatedRequest & { params: { code: string } },
  res: Response
): Promise<void> => {
  try {
    const { code } = req.params;

    const game = await Game.findOne({ code: code.toUpperCase() })
      .populate("players.user", "fullName username profilePic")
      .populate("host", "fullName username profilePic");

    if (!game) {
      res.status(404).json({ error: "Game not found" });
      return;
    }

    res.status(200).json({ game });
  } catch (error) {
    if (error instanceof Error) {
      console.log("Error in getGame controller:", error.message);
    }
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get user's active games
export const getMyGames = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user!._id;

    const games = await Game.find({
      "players.user": userId,
      status: { $ne: "ended" },
    })
      .populate("players.user", "fullName username profilePic")
      .populate("host", "fullName username profilePic")
      .sort({ updatedAt: -1 });

    res.status(200).json({ games });
  } catch (error) {
    if (error instanceof Error) {
      console.log("Error in getMyGames controller:", error.message);
    }
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Leave a game
export const leaveGame = async (
  req: AuthenticatedRequest & { params: { code: string } },
  res: Response
): Promise<void> => {
  try {
    const userId = req.user!._id;
    const { code } = req.params;

    const game = await Game.findOne({ code: code.toUpperCase() });

    if (!game) {
      res.status(404).json({ error: "Game not found" });
      return;
    }

    if (game.status !== "lobby") {
      res.status(400).json({ error: "Cannot leave game that has started" });
      return;
    }

    // Remove player from game
    game.players = game.players.filter(
      (p) => p.user.toString() !== userId.toString()
    );

    // If host leaves, either assign new host or delete game
    if (game.host.toString() === userId.toString()) {
      if (game.players.length > 0) {
        game.host = game.players[0].user;
      } else {
        await Game.findByIdAndDelete(game._id);
        res.status(200).json({ message: "Game deleted (no players left)" });
        return;
      }
    }

    await game.save();

    res.status(200).json({ message: "Left game successfully" });
  } catch (error) {
    if (error instanceof Error) {
      console.log("Error in leaveGame controller:", error.message);
    }
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get available word categories
export const getWordCategories = async (
  _req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const categories = getCategories();
    res.status(200).json({ categories });
  } catch (error) {
    if (error instanceof Error) {
      console.log("Error in getWordCategories controller:", error.message);
    }
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Update game settings (host only)
export const updateGameSettings = async (
  req: AuthenticatedRequest & {
    params: { code: string };
    body: { settings: Partial<GameSettings> };
  },
  res: Response
): Promise<void> => {
  try {
    const userId = req.user!._id;
    const { code } = req.params;
    const { settings } = req.body;

    const game = await Game.findOne({ code: code.toUpperCase() });

    if (!game) {
      res.status(404).json({ error: "Game not found" });
      return;
    }

    if (game.host.toString() !== userId.toString()) {
      res.status(403).json({ error: "Only host can update settings" });
      return;
    }

    if (game.status !== "lobby") {
      res.status(400).json({ error: "Cannot update settings after game started" });
      return;
    }

    // Update settings
    game.settings = { ...game.settings, ...settings };
    game.tokens = { ...game.settings.tokenCounts };

    await game.save();

    const populatedGame = await Game.findById(game._id)
      .populate("players.user", "fullName username profilePic")
      .populate("host", "fullName username profilePic");

    res.status(200).json({
      message: "Settings updated successfully",
      game: populatedGame,
    });
  } catch (error) {
    if (error instanceof Error) {
      console.log("Error in updateGameSettings controller:", error.message);
    }
    res.status(500).json({ error: "Internal Server Error" });
  }
};
