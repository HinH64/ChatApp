import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaTrophy,
  FaHome,
  FaRedo,
  FaEye,
  FaUser,
  FaCheck,
  FaTimes,
  FaQuestion,
  FaFire,
  FaChevronDown,
  FaChevronUp,
  FaCrown,
  FaStar,
  FaSignOutAlt,
} from "react-icons/fa";
import { GiWolfHead, GiVillage } from "react-icons/gi";
import { useGameContext } from "../../context/GameContext";
import useGameSocket from "../../hooks/game/useGameSocket";
import useRightPanel from "../../zustand/useRightPanel";
import type { User, GameRole, TokenType, GameQuestion } from "../../types";
import Avatar from "../ui/Avatar";

const roleIcons: Record<GameRole, React.ReactNode> = {
  mayor: <FaUser className="text-primary" />,
  seer: <FaEye className="text-info" />,
  werewolf: <GiWolfHead className="text-error" />,
  villager: <FaUser className="text-success" />,
};

const roleColors: Record<GameRole, string> = {
  mayor: "bg-primary/20 border-primary/50",
  seer: "bg-info/20 border-info/50",
  werewolf: "bg-error/20 border-error/50",
  villager: "bg-success/20 border-success/50",
};

const tokenIcons: Record<TokenType, React.ReactNode> = {
  yes: <FaCheck className="text-success" />,
  no: <FaTimes className="text-error" />,
  maybe: <FaQuestion className="text-warning" />,
  soClose: <FaFire className="text-info" />,
};

const tokenLabels: Record<TokenType, string> = {
  yes: "Yes",
  no: "No",
  maybe: "Maybe",
  soClose: "So Close!",
};

interface GameResultsProps {
  onReturnToMenu?: () => void;
}

const GameResults = ({ onReturnToMenu }: GameResultsProps) => {
  const navigate = useNavigate();
  const { currentGame, setCurrentGame, setMyRole, isHost } = useGameContext();
  const { restartGame } = useGameSocket();
  const { setCurrentView } = useRightPanel();
  const [showHistory, setShowHistory] = useState(false);

  if (!currentGame) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  const isVillageWin = currentGame.winner === "village";

  // Find special players
  const guesser = currentGame.guessedBy
    ? currentGame.players.find(
        (p) => (p.user as User)._id === currentGame.guessedBy
      )
    : null;
  const seer = currentGame.players.find((p) => p.role === "seer");
  const werewolves = currentGame.players.filter((p) => p.role === "werewolf");

  const handlePlayAgain = () => {
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
    <div className="h-full bg-base-100 flex flex-col items-center p-3 overflow-y-auto">
      {/* Winner Banner - Compact */}
      <div
        className={`w-full max-w-2xl text-center p-4 rounded-2xl mb-3 relative overflow-hidden ${
          isVillageWin ? "bg-success/20" : "bg-error/20"
        }`}
      >
        <div className="flex items-center justify-center gap-4">
          <div className="relative">
            {isVillageWin ? (
              <GiVillage className="text-5xl text-success" />
            ) : (
              <GiWolfHead className="text-5xl text-error" />
            )}
            <FaCrown className="absolute -top-2 left-1/2 -translate-x-1/2 text-lg text-yellow-500" />
          </div>
          <div className="text-left">
            <h1 className="text-2xl font-bold">
              {isVillageWin ? "Village Wins!" : "Werewolves Win!"}
            </h1>
            <p className="text-sm text-base-content/70">
              {currentGame.wordGuessed
                ? isVillageWin
                  ? "Word guessed, Seer hidden!"
                  : "Word guessed, Seer found!"
                : isVillageWin
                ? "Werewolf identified!"
                : "Werewolves escaped!"}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content - Two Column Layout */}
      <div className="w-full max-w-2xl grid grid-cols-2 gap-3 mb-3">
        {/* Left Column */}
        <div className="space-y-3">
          {/* Magic Word */}
          <div className="card bg-base-200">
            <div className="card-body p-3 items-center text-center">
              <p className="text-xs text-base-content/60">Magic Word</p>
              <p className="text-xl font-bold text-primary">{currentGame.magicWord}</p>
              {currentGame.wordGuessed && guesser ? (
                <div className="flex items-center gap-1 text-xs bg-success/20 px-2 py-1 rounded-full">
                  <FaCheck className="text-success text-xs" />
                  <span>by {(guesser.user as User).fullName}</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-xs bg-warning/20 px-2 py-1 rounded-full">
                  <FaTimes className="text-warning text-xs" />
                  <span>Not guessed</span>
                </div>
              )}
            </div>
          </div>

          {/* Key Players */}
          <div className="card bg-base-200">
            <div className="card-body p-3">
              <h3 className="font-bold text-sm flex items-center gap-1 mb-2">
                <FaStar className="text-yellow-500" /> Key Players
              </h3>
              <div className="space-y-2">
                {seer && (
                  <div className="flex items-center gap-2 p-2 bg-info/10 rounded-lg border border-info/30">
                    <FaEye className="text-info text-sm" />
                    <Avatar
                      src={(seer.user as User).profilePic}
                      alt={(seer.user as User).fullName}
                      size="sm"
                    />
                    <span className="text-sm truncate">{(seer.user as User).fullName}</span>
                    <span className="text-xs text-info ml-auto">Seer</span>
                  </div>
                )}
                {werewolves.map((wolf) => (
                  <div
                    key={(wolf.user as User)._id}
                    className="flex items-center gap-2 p-2 bg-error/10 rounded-lg border border-error/30"
                  >
                    <GiWolfHead className="text-error text-sm" />
                    <Avatar
                      src={(wolf.user as User).profilePic}
                      alt={(wolf.user as User).fullName}
                      size="sm"
                    />
                    <span className="text-sm truncate">{(wolf.user as User).fullName}</span>
                    <span className="text-xs text-error ml-auto">Wolf</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Game Stats */}
          <div className="card bg-base-200">
            <div className="card-body p-3">
              <h3 className="font-bold text-sm mb-2">Stats</h3>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 bg-base-300 rounded-lg">
                  <p className="text-lg font-bold text-primary">{currentGame.questions.length}</p>
                  <p className="text-xs text-base-content/60">Q's</p>
                </div>
                <div className="p-2 bg-base-300 rounded-lg">
                  <p className="text-lg font-bold text-success">
                    {currentGame.tokensUsed.filter((t) => t.token === "yes").length}
                  </p>
                  <p className="text-xs text-base-content/60">Yes</p>
                </div>
                <div className="p-2 bg-base-300 rounded-lg">
                  <p className="text-lg font-bold text-error">
                    {currentGame.tokensUsed.filter((t) => t.token === "no").length}
                  </p>
                  <p className="text-xs text-base-content/60">No</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - All Players */}
        <div className="card bg-base-200">
          <div className="card-body p-3">
            <h3 className="font-bold text-sm flex items-center gap-1 mb-2">
              <FaTrophy className="text-yellow-500" /> All Players
            </h3>
            <div className="space-y-1.5 max-h-[280px] overflow-y-auto pr-1">
              {currentGame.players.map((player) => {
                const user = player.user as User;
                const isWinner =
                  (isVillageWin && player.role !== "werewolf") ||
                  (!isVillageWin && player.role === "werewolf");
                return (
                  <div
                    key={user._id}
                    className={`flex items-center gap-2 p-2 rounded-lg border ${
                      player.role ? roleColors[player.role] : "bg-base-300"
                    }`}
                  >
                    <div className="relative">
                      <Avatar src={user.profilePic} alt={user.fullName} size="sm" />
                      {isWinner && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center">
                          <FaCrown className="text-[8px] text-yellow-900" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{user.fullName}</div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <span className="text-base">{player.role && roleIcons[player.role]}</span>
                      <span className="text-xs font-medium capitalize">{player.role}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Questions History - Collapsible */}
      {currentGame.questions.length > 0 && (
        <div className="w-full max-w-2xl card bg-base-200 mb-3">
          <div className="card-body p-3">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="flex items-center justify-between w-full"
            >
              <h3 className="font-bold text-sm flex items-center gap-1">
                <FaQuestion className="text-primary" />
                Questions ({currentGame.questions.length})
              </h3>
              <div className="btn btn-ghost btn-xs btn-circle">
                {showHistory ? <FaChevronUp /> : <FaChevronDown />}
              </div>
            </button>

            {showHistory && (
              <div className="mt-2 space-y-2 max-h-40 overflow-y-auto pr-1">
                {currentGame.questions.map((q, index) => (
                  <QuestionHistoryItem key={index} question={q} />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Action Buttons - Compact */}
      <div className="w-full max-w-2xl card bg-base-200">
        <div className="card-body p-3">
          <div className="flex items-center justify-center gap-2">
            {isHost && (
              <button
                onClick={handleRestartGame}
                className="btn btn-primary btn-sm gap-1 flex-1"
              >
                <FaRedo className="text-xs" /> Play Again
              </button>
            )}
            <button
              onClick={handleGoHome}
              className="btn btn-outline btn-sm gap-1 flex-1"
            >
              <FaHome className="text-xs" /> Home
            </button>
            <button
              onClick={handlePlayAgain}
              className="btn btn-ghost btn-sm gap-1"
            >
              <FaSignOutAlt className="text-xs" /> Leave
            </button>
          </div>
          {!isHost && (
            <p className="text-center text-xs text-base-content/60 mt-1">
              Waiting for host to restart...
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

// Read-only question history item - Compact
const QuestionHistoryItem = ({ question }: { question: GameQuestion }) => {
  const player = question.playerId as User;

  return (
    <div
      className={`p-2 rounded-lg text-sm ${
        question.isGuess ? "bg-primary/20 border border-primary/50" : "bg-base-300"
      }`}
    >
      <div className="flex items-center gap-2">
        <Avatar src={player.profilePic} alt={player.fullName} size="xs" />
        <span className="font-medium text-xs">{player.fullName}</span>
        {question.isGuess && (
          <span className="badge badge-primary badge-xs">GUESS</span>
        )}
        <div className="flex-1" />
        {question.response && (
          <div className="flex items-center gap-1">
            {tokenIcons[question.response]}
            <span className="text-xs">{tokenLabels[question.response]}</span>
          </div>
        )}
      </div>
      <p className="text-xs mt-1 ml-6">{question.text}</p>
    </div>
  );
};

export default GameResults;
