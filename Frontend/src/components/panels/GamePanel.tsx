import { useState } from "react";
import { FaPlus, FaSignInAlt, FaGamepad } from "react-icons/fa";
import toast from "react-hot-toast";
import { useGameContext } from "../../context/GameContext";
import useCreateGame from "../../hooks/game/useCreateGame";
import useJoinGame from "../../hooks/game/useJoinGame";
import GameLobbyPanel from "./GameLobbyPanel";
import GamePlayPanel from "./GamePlayPanel";

const GamePanel = () => {
  const { currentGame } = useGameContext();

  // Show different views based on game state
  if (currentGame) {
    if (currentGame.status === "lobby") {
      return <GameLobbyPanel />;
    }
    return <GamePlayPanel />;
  }

  return <GameMenuPanel />;
};

const GameMenuPanel = () => {
  const { setCurrentGame } = useGameContext();
  const { createGame, loading: createLoading } = useCreateGame();
  const { joinGame, loading: joinLoading } = useJoinGame();

  const [showJoinInput, setShowJoinInput] = useState(false);
  const [roomCode, setRoomCode] = useState("");

  const handleCreateGame = async () => {
    const game = await createGame();
    if (game) {
      setCurrentGame(game);
    }
  };

  const handleJoinGame = async (e: React.FormEvent) => {
    e.preventDefault();

    if (roomCode.length !== 4) {
      toast.error("Room code must be 4 letters");
      return;
    }

    const game = await joinGame(roomCode);
    if (game) {
      setCurrentGame(game);
    }
  };

  return (
    <div className="flex flex-col w-full h-full bg-base-100">
      <div className="flex items-center justify-center flex-1 p-4">
        <div className="card bg-base-200 w-full max-w-md">
          <div className="card-body">
            {/* Header */}
            <div className="flex items-center gap-4 mb-4">
              <div>
                <h1 className="card-title text-2xl gap-2">
                  <FaGamepad className="text-primary" />
                  Werewords
                </h1>
                <p className="text-sm text-base-content/60">
                  A word-guessing social deduction game
                </p>
              </div>
            </div>

            <div className="divider"></div>

            {/* Create Game Button */}
            <button
              onClick={handleCreateGame}
              disabled={createLoading}
              className="btn btn-primary btn-lg gap-2"
            >
              {createLoading ? (
                <span className="loading loading-spinner"></span>
              ) : (
                <FaPlus />
              )}
              Create New Game
            </button>

            <div className="divider">OR</div>

            {/* Join Game */}
            {!showJoinInput ? (
              <button
                onClick={() => setShowJoinInput(true)}
                className="btn btn-outline btn-lg gap-2"
              >
                <FaSignInAlt />
                Join Game
              </button>
            ) : (
              <form onSubmit={handleJoinGame} className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Enter Room Code</span>
                  </label>
                  <input
                    type="text"
                    placeholder="ABCD"
                    value={roomCode}
                    onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                    maxLength={4}
                    className="input input-bordered input-lg text-center font-mono tracking-widest"
                    autoFocus
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowJoinInput(false);
                      setRoomCode("");
                    }}
                    className="btn btn-ghost flex-1"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={joinLoading || roomCode.length !== 4}
                    className="btn btn-primary flex-1"
                  >
                    {joinLoading ? (
                      <span className="loading loading-spinner"></span>
                    ) : (
                      "Join"
                    )}
                  </button>
                </div>
              </form>
            )}

            <div className="divider"></div>

            {/* How to Play */}
            <div className="collapse collapse-arrow bg-base-300">
              <input type="checkbox" />
              <div className="collapse-title font-medium">How to Play</div>
              <div className="collapse-content text-sm space-y-2">
                <p>
                  <strong>Objective:</strong> Players ask yes/no questions to
                  guess a secret Magic Word.
                </p>
                <p>
                  <strong>Roles:</strong>
                </p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>
                    <strong>Mayor:</strong> Knows the word, responds with tokens
                  </li>
                  <li>
                    <strong>Seer:</strong> Knows the word, subtly helps village
                  </li>
                  <li>
                    <strong>Werewolf:</strong> Knows the word, tries to mislead
                  </li>
                  <li>
                    <strong>Villager:</strong> Asks questions, guesses the word
                  </li>
                </ul>
                <p>
                  <strong>Win Conditions:</strong>
                </p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>
                    If word is guessed: Werewolves vote for Seer. Village wins if
                    they fail.
                  </li>
                  <li>
                    If word is NOT guessed: Village votes for Werewolf. Village
                    wins if they find one.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamePanel;
