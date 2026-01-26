import { useNavigate } from "react-router-dom";
import { FaTrophy, FaHome, FaRedo, FaEye, FaUser } from "react-icons/fa";
import { GiWolfHead, GiVillage } from "react-icons/gi";
import { useGameContext } from "../../context/GameContext";
import useGameSocket from "../../hooks/game/useGameSocket";
import useRightPanel from "../../zustand/useRightPanel";
import type { User, GameRole } from "../../types";
import Avatar from "../ui/Avatar";

const roleIcons: Record<GameRole, React.ReactNode> = {
  mayor: <FaUser className="text-primary" />,
  seer: <FaEye className="text-info" />,
  werewolf: <GiWolfHead className="text-error" />,
  villager: <FaUser className="text-success" />,
};

interface GameResultsProps {
  onReturnToMenu?: () => void;
}

const GameResults = ({ onReturnToMenu }: GameResultsProps) => {
  const navigate = useNavigate();
  const { currentGame, setCurrentGame, setMyRole, isHost } = useGameContext();
  const { restartGame } = useGameSocket();
  const { setCurrentView } = useRightPanel();

  if (!currentGame) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  const isVillageWin = currentGame.winner === "village";

  const handlePlayAgain = () => {
    // Reset game state and go back to menu
    setCurrentGame(null);
    setMyRole(null);
    if (onReturnToMenu) {
      onReturnToMenu();
    } else {
      navigate("/game");
    }
  };

  const handleRestartGame = () => {
    if (currentGame) {
      restartGame(currentGame.code);
    }
  };

  const handleGoHome = () => {
    setCurrentGame(null);
    setMyRole(null);
    if (onReturnToMenu) {
      setCurrentView("chat");
    } else {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-base-100 flex flex-col items-center justify-center p-4">
      {/* Winner Announcement */}
      <div
        className={`text-center mb-8 p-8 rounded-2xl ${
          isVillageWin ? "bg-success/20" : "bg-error/20"
        }`}
      >
        <div className="mb-4">
          {isVillageWin ? (
            <GiVillage className="text-8xl text-success mx-auto" />
          ) : (
            <GiWolfHead className="text-8xl text-error mx-auto" />
          )}
        </div>
        <h1 className="text-4xl font-bold mb-2">
          {isVillageWin ? "Village Wins!" : "Werewolves Win!"}
        </h1>
        <p className="text-lg text-base-content/70">
          {currentGame.wordGuessed
            ? isVillageWin
              ? "The word was guessed and werewolves failed to identify the Seer!"
              : "The word was guessed but werewolves identified the Seer!"
            : isVillageWin
            ? "Time ran out but the village identified a werewolf!"
            : "Time ran out and the werewolves were not found!"}
        </p>
      </div>

      {/* Magic Word */}
      <div className="card bg-base-200 w-full max-w-md mb-6">
        <div className="card-body items-center text-center">
          <h2 className="card-title">The Magic Word was:</h2>
          <p className="text-3xl font-bold text-primary">
            {currentGame.magicWord}
          </p>
          {currentGame.wordGuessed && currentGame.guessedBy && (
            <p className="text-sm text-base-content/60 mt-2">
              Guessed correctly!
            </p>
          )}
        </div>
      </div>

      {/* All Players & Roles */}
      <div className="card bg-base-200 w-full max-w-md mb-6">
        <div className="card-body">
          <h2 className="card-title justify-center mb-4">
            <FaTrophy className="text-yellow-500" /> Players & Roles
          </h2>
          <div className="space-y-3">
            {currentGame.players.map((player) => {
              const user = player.user as User;
              return (
                <div
                  key={user._id}
                  className="flex items-center gap-3 p-3 bg-base-300 rounded-lg"
                >
                  <Avatar
                    src={user.profilePic}
                    alt={user.fullName}
                    size="md"
                  />
                  <div className="flex-1">
                    <div className="font-medium">{user.fullName}</div>
                    <div className="text-sm text-base-content/60">
                      @{user.username}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {player.role && roleIcons[player.role]}
                    <span className="font-bold capitalize">{player.role}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Game Stats */}
      <div className="card bg-base-200 w-full max-w-md mb-6">
        <div className="card-body">
          <h2 className="card-title justify-center mb-4">Game Stats</h2>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-3 bg-base-300 rounded-lg">
              <p className="text-2xl font-bold">{currentGame.questions.length}</p>
              <p className="text-sm text-base-content/60">Questions Asked</p>
            </div>
            <div className="p-3 bg-base-300 rounded-lg">
              <p className="text-2xl font-bold">{currentGame.tokensUsed.length}</p>
              <p className="text-sm text-base-content/60">Tokens Used</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap justify-center gap-4">
        <button onClick={handleGoHome} className="btn btn-outline gap-2">
          <FaHome /> Home
        </button>
        {isHost && (
          <button onClick={handleRestartGame} className="btn btn-primary gap-2">
            <FaRedo /> Restart Game
          </button>
        )}
        <button onClick={handlePlayAgain} className="btn btn-ghost gap-2">
          Leave
        </button>
      </div>
    </div>
  );
};

export default GameResults;
