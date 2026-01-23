import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGameContext } from "../../context/GameContext";
import useGameSocket from "../../hooks/game/useGameSocket";
import NightPhase from "../../components/game/NightPhase";
import DayPhase from "../../components/game/DayPhase";
import VotingPhase from "../../components/game/VotingPhase";
import GameResults from "../../components/game/GameResults";

const GamePlay = () => {
  const navigate = useNavigate();
  const { currentGame } = useGameContext();
  const { joinGameRoom } = useGameSocket();

  useEffect(() => {
    if (!currentGame) {
      navigate("/game");
      return;
    }

    // Rejoin the game room
    joinGameRoom(currentGame.code);
  }, [currentGame?.code]);

  // Redirect to lobby if game is in lobby state
  useEffect(() => {
    if (currentGame?.status === "lobby") {
      navigate("/game/lobby");
    }
  }, [currentGame?.status, navigate]);

  if (!currentGame) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100">
      {currentGame.status === "night" && <NightPhase />}
      {currentGame.status === "day" && <DayPhase />}
      {currentGame.status === "voting" && <VotingPhase />}
      {currentGame.status === "ended" && <GameResults />}
    </div>
  );
};

export default GamePlay;
