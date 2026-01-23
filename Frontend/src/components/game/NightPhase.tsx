import { useState } from "react";
import { FaMoon, FaEye, FaUserSecret, FaUser } from "react-icons/fa";
import { GiWolfHead } from "react-icons/gi";
import { useGameContext } from "../../context/GameContext";
import useGameSocket from "../../hooks/game/useGameSocket";
import type { GameRole } from "../../types";

const roleInfo: Record<
  GameRole,
  { icon: React.ReactNode; name: string; description: string; color: string }
> = {
  mayor: {
    icon: <FaUser className="text-4xl" />,
    name: "Mayor",
    description: "You know the Magic Word. Respond to questions with tokens.",
    color: "text-primary",
  },
  seer: {
    icon: <FaEye className="text-4xl" />,
    name: "Seer",
    description:
      "You know the Magic Word. Subtly guide the village to guess it.",
    color: "text-info",
  },
  werewolf: {
    icon: <GiWolfHead className="text-4xl" />,
    name: "Werewolf",
    description:
      "You know the Magic Word. Try to mislead the village. If they guess it, identify the Seer!",
    color: "text-error",
  },
  villager: {
    icon: <FaUserSecret className="text-4xl" />,
    name: "Villager",
    description:
      "Ask good questions to discover the Magic Word before time runs out!",
    color: "text-success",
  },
};

const NightPhase = () => {
  const { currentGame, myRole } = useGameContext();
  const { selectWord } = useGameSocket();
  const [selectedWord, setSelectedWord] = useState<string | null>(null);

  if (!currentGame || !myRole) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  const role = roleInfo[myRole];

  const handleSelectWord = () => {
    if (selectedWord) {
      selectWord(currentGame.code, selectedWord);
    }
  };

  return (
    <div className="min-h-screen bg-base-300 flex flex-col items-center justify-center p-4">
      {/* Night Header */}
      <div className="text-center mb-8">
        <FaMoon className="text-6xl text-yellow-300 mx-auto mb-4" />
        <h1 className="text-3xl font-bold">Night Phase</h1>
        <p className="text-base-content/60">Everyone close your eyes...</p>
      </div>

      {/* Role Card */}
      <div className="card bg-base-100 w-full max-w-md shadow-xl">
        <div className="card-body items-center text-center">
          <div className={`${role.color} mb-4`}>{role.icon}</div>
          <h2 className="card-title text-2xl">{role.name}</h2>
          <p className="text-base-content/70">{role.description}</p>

          {/* Show Magic Word for Seer and Werewolf */}
          {(myRole === "seer" || myRole === "werewolf") && currentGame.magicWord && (
            <div className="mt-4 p-4 bg-base-200 rounded-lg w-full">
              <p className="text-sm text-base-content/60 mb-1">
                The Magic Word is:
              </p>
              <p className="text-2xl font-bold text-primary">
                {currentGame.magicWord}
              </p>
            </div>
          )}

          {/* Mayor Word Selection */}
          {myRole === "mayor" && !currentGame.magicWord && (
            <div className="mt-4 w-full">
              <p className="text-sm text-base-content/60 mb-3">
                Choose the Magic Word:
              </p>
              <div className="grid grid-cols-1 gap-2">
                {currentGame.wordOptions.map((word) => (
                  <button
                    key={word}
                    onClick={() => setSelectedWord(word)}
                    className={`btn ${
                      selectedWord === word ? "btn-primary" : "btn-outline"
                    }`}
                  >
                    {word}
                  </button>
                ))}
              </div>
              {selectedWord && (
                <button
                  onClick={handleSelectWord}
                  className="btn btn-success w-full mt-4"
                >
                  Confirm Selection
                </button>
              )}
            </div>
          )}

          {/* Waiting message for villagers */}
          {myRole === "villager" && (
            <div className="mt-4 text-base-content/60">
              <span className="loading loading-dots loading-sm"></span>
              <p>Waiting for night to end...</p>
            </div>
          )}

          {/* Mayor confirmed word, waiting for day */}
          {myRole === "mayor" && currentGame.magicWord && (
            <div className="mt-4 p-4 bg-base-200 rounded-lg w-full">
              <p className="text-sm text-base-content/60 mb-1">
                You selected:
              </p>
              <p className="text-2xl font-bold text-primary">
                {currentGame.magicWord}
              </p>
              <p className="text-sm text-base-content/60 mt-2">
                Day phase will begin shortly...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NightPhase;
