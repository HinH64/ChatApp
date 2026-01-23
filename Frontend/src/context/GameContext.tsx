import { createContext, useState, useContext, ReactNode, useCallback } from "react";
import { useAuthContext } from "./AuthContext";
import type { Game, GameRole, GameContextType } from "../types";

const GameContext = createContext<GameContextType | null>(null);

export const useGameContext = (): GameContextType => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGameContext must be used within a GameContextProvider");
  }
  return context;
};

interface GameContextProviderProps {
  children: ReactNode;
}

export const GameContextProvider = ({ children }: GameContextProviderProps) => {
  const [currentGame, setCurrentGameState] = useState<Game | null>(null);
  const [myRole, setMyRole] = useState<GameRole | null>(null);
  const { authUser } = useAuthContext();

  const setCurrentGame = useCallback(
    (game: Game | null | ((prev: Game | null) => Game | null)) => {
      if (typeof game === "function") {
        setCurrentGameState((prev) => {
          const newGame = game(prev);
          if (newGame) {
            sessionStorage.setItem("current-game-code", newGame.code);
          } else {
            sessionStorage.removeItem("current-game-code");
          }
          return newGame;
        });
      } else {
        setCurrentGameState(game);
        if (game) {
          sessionStorage.setItem("current-game-code", game.code);
        } else {
          sessionStorage.removeItem("current-game-code");
        }
      }
    },
    []
  );

  const isHost = currentGame?.host._id === authUser?._id;

  return (
    <GameContext.Provider
      value={{
        currentGame,
        setCurrentGame,
        myRole,
        setMyRole,
        isHost,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
