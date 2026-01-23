import { useState } from "react";
import toast from "react-hot-toast";
import type { Game, GameSettings, ApiError } from "../../types";

interface CreateGameResponse {
  message: string;
  game: Game;
}

const useCreateGame = () => {
  const [loading, setLoading] = useState(false);

  const createGame = async (
    settings?: Partial<GameSettings>
  ): Promise<Game | null> => {
    setLoading(true);
    try {
      const res = await fetch("/api/games/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ settings }),
      });

      const data: CreateGameResponse | ApiError = await res.json();

      if (!res.ok) {
        throw new Error((data as ApiError).error || "Failed to create game");
      }

      toast.success("Game created!");
      return (data as CreateGameResponse).game;
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { createGame, loading };
};

export default useCreateGame;
