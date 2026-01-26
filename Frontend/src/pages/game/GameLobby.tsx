import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaCopy, FaArrowLeft, FaPlay, FaUsers } from "react-icons/fa";
import toast from "react-hot-toast";
import { useGameContext } from "../../context/GameContext";
import useGameSocket from "../../hooks/game/useGameSocket";
import PlayerCard from "../../components/game/PlayerCard";
import GameSettings from "../../components/game/GameSettings";
import type { GameSettings as GameSettingsType } from "../../types";

const GameLobby = () => {
  const navigate = useNavigate();
  const { currentGame, isHost } = useGameContext();
  const { joinGameRoom, leaveGameRoom, startGame, updateSettings } = useGameSocket();

  useEffect(() => {
    if (currentGame) {
      joinGameRoom(currentGame.code);
    }

    return () => {
      if (currentGame) {
        leaveGameRoom(currentGame.code);
      }
    };
  }, [currentGame?.code]);

  // Redirect if game started
  useEffect(() => {
    if (currentGame?.status === "night" || currentGame?.status === "day") {
      navigate("/game/play");
    }
  }, [currentGame?.status, navigate]);

  const handleCopyCode = () => {
    if (currentGame) {
      navigator.clipboard.writeText(currentGame.code);
      toast.success("Room code copied!");
    }
  };

  const handleStartGame = () => {
    if (currentGame && currentGame.players.length >= 4) {
      startGame(currentGame.code);
    } else {
      toast.error("Need at least 4 players to start");
    }
  };

  const handleSettingsChange = (settings: Partial<GameSettingsType>) => {
    if (!currentGame || !isHost) return;
    updateSettings(currentGame.code, settings);
  };

  const handleLeave = async () => {
    if (!currentGame) return;

    try {
      await fetch(`/api/games/${currentGame.code}/leave`, {
        method: "DELETE",
      });
      navigate("/game");
    } catch (error) {
      console.error("Error leaving game:", error);
      navigate("/game");
    }
  };

  if (!currentGame) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={handleLeave}
            className="btn btn-ghost btn-sm gap-2"
          >
            <FaArrowLeft /> Leave
          </button>
          <h1 className="text-2xl font-bold">Game Lobby</h1>
          <div></div>
        </div>

        {/* Room Code */}
        <div className="card bg-base-200 mb-6">
          <div className="card-body items-center text-center">
            <h2 className="card-title text-sm text-base-content/60">
              Room Code
            </h2>
            <div className="flex items-center gap-4">
              <span className="text-4xl font-mono font-bold tracking-widest">
                {currentGame.code}
              </span>
              <button
                onClick={handleCopyCode}
                className="btn btn-circle btn-sm"
                title="Copy code"
              >
                <FaCopy />
              </button>
            </div>
            <p className="text-sm text-base-content/60">
              Share this code with friends to join
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Players List */}
          <div className="card bg-base-200">
            <div className="card-body">
              <h2 className="card-title">
                <FaUsers className="mr-2" />
                Players ({currentGame.players.length}/8)
              </h2>
              <div className="space-y-2">
                {currentGame.players.map((player) => (
                  <PlayerCard
                    key={player.user._id}
                    player={player}
                    isHost={player.user._id === currentGame.host._id}
                  />
                ))}
              </div>

              {currentGame.players.length < 4 && (
                <div className="alert alert-warning mt-4">
                  <span>Need at least 4 players to start</span>
                </div>
              )}
            </div>
          </div>

          {/* Settings */}
          <div className="card bg-base-200">
            <div className="card-body">
              <GameSettings
                settings={currentGame.settings}
                isHost={isHost}
                onSettingsChange={handleSettingsChange}
              />
            </div>
          </div>
        </div>

        {/* Start Button (Host Only) */}
        {isHost && (
          <div className="mt-6 flex justify-center">
            <button
              onClick={handleStartGame}
              disabled={currentGame.players.length < 4}
              className="btn btn-primary btn-lg gap-2"
            >
              <FaPlay /> Start Game
            </button>
          </div>
        )}

        {!isHost && (
          <div className="mt-6 text-center text-base-content/60">
            Waiting for host to start the game...
          </div>
        )}
      </div>
    </div>
  );
};

export default GameLobby;
