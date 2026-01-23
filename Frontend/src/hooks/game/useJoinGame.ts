import { useState } from "react";
import toast from "react-hot-toast";
import type { Game, ApiError } from "../../types";

interface JoinGameResponse {
  message: string;
  game: Game;
}

const useJoinGame = () => {
  const [loading, setLoading] = useState(false);

  const joinGame = async (code: string): Promise<Game | null> => {
    setLoading(true);
    try {
      const res = await fetch("/api/games/join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: code.toUpperCase() }),
      });

      const data: JoinGameResponse | ApiError = await res.json();

      if (!res.ok) {
        throw new Error((data as ApiError).error || "Failed to join game");
      }

      toast.success("Joined game!");
      return (data as JoinGameResponse).game;
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { joinGame, loading };
};

export default useJoinGame;
