import { useEffect } from "react";
import { useGameContext } from "../../context/GameContext";
import useGameSocket from "../../hooks/game/useGameSocket";
import NightPhase from "../game/NightPhase";
import DayPhase from "../game/DayPhase";
import VotingPhase from "../game/VotingPhase";
import GameResults from "../game/GameResults";

const GamePlayPanel = () => {
  const { currentGame, setCurrentGame } = useGameContext();
  const { joinGameRoom } = useGameSocket();

  useEffect(() => {
    if (!currentGame) {
      return;
    }

    // Rejoin the game room
    joinGameRoom(currentGame.code);
  }, [currentGame?.code]);

  if (!currentGame) {
    return (
      <div className="flex items-center justify-center h-full">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  // When game ends and user wants to go back to menu
  const handleReturnToMenu = () => {
    setCurrentGame(null);
  };

  return (
    <div className="flex flex-col w-full h-full bg-base-100 overflow-y-auto">
      {currentGame.status === "night" && <NightPhase />}
      {currentGame.status === "day" && <DayPhase />}
      {currentGame.status === "voting" && <VotingPhase />}
      {currentGame.status === "ended" && <GameResults onReturnToMenu={handleReturnToMenu} />}
    </div>
  );
};

export default GamePlayPanel;
