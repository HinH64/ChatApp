import { useState } from "react";
import { FaTimes, FaExclamationTriangle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useGameContext } from "../../context/GameContext";
import useGameSocket from "../../hooks/game/useGameSocket";
import useRightPanel from "../../zustand/useRightPanel";

interface ExitGameButtonProps {
  isPanel?: boolean;
}

const ExitGameButton = ({ isPanel = false }: ExitGameButtonProps) => {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const { currentGame, setCurrentGame, setMyRole } = useGameContext();
  const { leaveGameRoom } = useGameSocket();
  const { setCurrentView } = useRightPanel();

  const handleExit = () => {
    if (currentGame) {
      leaveGameRoom(currentGame.code);
    }
    setCurrentGame(null);
    setMyRole(null);

    if (isPanel) {
      setCurrentView("game");
    } else {
      navigate("/game");
    }
    setShowModal(false);
  };

  const isGameInProgress =
    currentGame?.status === "night" ||
    currentGame?.status === "day" ||
    currentGame?.status === "voting";

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="btn btn-ghost btn-sm btn-circle"
        title="Exit Game"
      >
        <FaTimes className="text-lg" />
      </button>

      {showModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <div className="flex items-center gap-3 mb-4">
              <FaExclamationTriangle className="text-3xl text-warning" />
              <h3 className="font-bold text-lg">Exit Game?</h3>
            </div>

            {isGameInProgress ? (
              <p className="text-base-content/70">
                The game is still in progress. If you leave now, you will
                abandon your team and cannot rejoin this game.
              </p>
            ) : (
              <p className="text-base-content/70">
                Are you sure you want to exit this game?
              </p>
            )}

            <div className="modal-action">
              <button
                onClick={() => setShowModal(false)}
                className="btn btn-ghost"
              >
                Cancel
              </button>
              <button onClick={handleExit} className="btn btn-error">
                Exit Game
              </button>
            </div>
          </div>
          <div
            className="modal-backdrop bg-black/50"
            onClick={() => setShowModal(false)}
          />
        </div>
      )}
    </>
  );
};

export default ExitGameButton;
