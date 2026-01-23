import { useEffect, useCallback } from "react";
import { useSocketContext } from "../../context/SocketContext";
import { useGameContext } from "../../context/GameContext";
import type { Game, GameRole, TokenType, GameQuestion } from "../../types";

interface GameStartedPayload {
  game: Game;
  role: GameRole;
}

interface DayStartPayload {
  game: Game;
  dayDuration: number;
}

interface NewQuestionPayload {
  question: GameQuestion;
  questionIndex: number;
}

interface TokenResponsePayload {
  questionIndex: number;
  token: TokenType;
  remainingTokens: {
    yes: number;
    no: number;
    maybe: number;
    soClose: number;
  };
}

interface WordGuessedPayload {
  guessedBy: string;
  word: string;
}

interface VotingStartPayload {
  game: Game;
  voteType: "findSeer" | "findWerewolf";
}

interface VoteCastPayload {
  voterId: string;
  votesCount: number;
  totalVoters: number;
}

interface GameOverPayload {
  winner: "village" | "werewolf";
  game: Game;
  eliminated: string;
  voteCounts: Record<string, number>;
}

interface PlayerEventPayload {
  game: Game;
  userId?: string;
}

const useGameSocket = () => {
  const { socket } = useSocketContext();
  const { setCurrentGame, setMyRole } = useGameContext();

  // Join game room
  const joinGameRoom = useCallback(
    (gameCode: string) => {
      if (socket) {
        socket.emit("game:join", { gameCode });
      }
    },
    [socket]
  );

  // Leave game room
  const leaveGameRoom = useCallback(
    (gameCode: string) => {
      if (socket) {
        socket.emit("game:leave", { gameCode });
      }
    },
    [socket]
  );

  // Start game (host only)
  const startGame = useCallback(
    (gameCode: string) => {
      if (socket) {
        socket.emit("game:start", { gameCode });
      }
    },
    [socket]
  );

  // Mayor selects word
  const selectWord = useCallback(
    (gameCode: string, word: string) => {
      if (socket) {
        socket.emit("game:selectWord", { gameCode, word });
      }
    },
    [socket]
  );

  // Ask a question
  const askQuestion = useCallback(
    (gameCode: string, text: string) => {
      if (socket) {
        socket.emit("game:question", { gameCode, text });
      }
    },
    [socket]
  );

  // Mayor responds with token
  const respondWithToken = useCallback(
    (gameCode: string, questionIndex: number, token: TokenType) => {
      if (socket) {
        socket.emit("game:mayorResponse", { gameCode, questionIndex, token });
      }
    },
    [socket]
  );

  // Time runs out (host triggers)
  const triggerTimeUp = useCallback(
    (gameCode: string) => {
      if (socket) {
        socket.emit("game:timeUp", { gameCode });
      }
    },
    [socket]
  );

  // Cast vote
  const castVote = useCallback(
    (gameCode: string, targetId: string) => {
      if (socket) {
        socket.emit("game:vote", { gameCode, targetId });
      }
    },
    [socket]
  );

  // Set up event listeners
  useEffect(() => {
    if (!socket) return;

    // Game state update
    socket.on("game:state", (data: { game: Game }) => {
      setCurrentGame(data.game);
    });

    // Player joined
    socket.on("game:playerJoined", (data: PlayerEventPayload) => {
      setCurrentGame(data.game);
    });

    // Player left
    socket.on("game:playerLeft", (data: PlayerEventPayload) => {
      setCurrentGame(data.game);
    });

    // Player disconnected
    socket.on("game:playerDisconnected", (data: PlayerEventPayload) => {
      setCurrentGame(data.game);
    });

    // Game started
    socket.on("game:started", (data: GameStartedPayload) => {
      setCurrentGame(data.game);
      setMyRole(data.role);
    });

    // Day phase started
    socket.on("game:dayStart", (data: DayStartPayload) => {
      setCurrentGame(data.game);
    });

    // New question asked
    socket.on("game:newQuestion", (data: NewQuestionPayload) => {
      setCurrentGame((prev) => {
        if (!prev) return null;
        const questions = [...prev.questions];
        questions[data.questionIndex] = data.question;
        return { ...prev, questions };
      });
    });

    // Token response
    socket.on("game:tokenResponse", (data: TokenResponsePayload) => {
      setCurrentGame((prev) => {
        if (!prev) return null;
        const questions = [...prev.questions];
        if (questions[data.questionIndex]) {
          questions[data.questionIndex] = {
            ...questions[data.questionIndex],
            response: data.token,
          };
        }
        return {
          ...prev,
          questions,
          tokens: data.remainingTokens,
        };
      });
    });

    // Word guessed
    socket.on("game:wordGuessed", (data: WordGuessedPayload) => {
      setCurrentGame((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          wordGuessed: true,
          guessedBy: data.guessedBy,
          magicWord: data.word,
        };
      });
    });

    // Voting started
    socket.on("game:votingStart", (data: VotingStartPayload) => {
      setCurrentGame(data.game);
    });

    // Vote cast
    socket.on("game:voteCast", (_data: VoteCastPayload) => {
      // Could update UI to show voting progress
    });

    // Game over
    socket.on("game:gameOver", (data: GameOverPayload) => {
      setCurrentGame(data.game);
    });

    // Error
    socket.on("game:error", (data: { message: string }) => {
      console.error("Game error:", data.message);
    });

    return () => {
      socket.off("game:state");
      socket.off("game:playerJoined");
      socket.off("game:playerLeft");
      socket.off("game:playerDisconnected");
      socket.off("game:started");
      socket.off("game:dayStart");
      socket.off("game:newQuestion");
      socket.off("game:tokenResponse");
      socket.off("game:wordGuessed");
      socket.off("game:votingStart");
      socket.off("game:voteCast");
      socket.off("game:gameOver");
      socket.off("game:error");
    };
  }, [socket, setCurrentGame, setMyRole]);

  return {
    joinGameRoom,
    leaveGameRoom,
    startGame,
    selectWord,
    askQuestion,
    respondWithToken,
    triggerTimeUp,
    castVote,
  };
};

export default useGameSocket;
