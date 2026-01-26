import { useState } from "react";
import { FaVoteYea, FaCheck } from "react-icons/fa";
import { GiWolfHead } from "react-icons/gi";
import { useGameContext } from "../../context/GameContext";
import { useAuthContext } from "../../context/AuthContext";
import useGameSocket from "../../hooks/game/useGameSocket";
import type { User } from "../../types";
import Avatar from "../ui/Avatar";

const VotingPhase = () => {
  const { currentGame, myRole } = useGameContext();
  const { authUser } = useAuthContext();
  const { castVote } = useGameSocket();
  const [selectedTarget, setSelectedTarget] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);

  if (!currentGame) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  // Determine if current player can vote
  const canVote =
    (currentGame.voteType === "findSeer" && myRole === "werewolf") ||
    (currentGame.voteType === "findWerewolf" && myRole !== "werewolf");

  // Get votable players (exclude self and mayor for findSeer)
  const votablePlayers = currentGame.players.filter((p) => {
    const playerId = (p.user as User)._id;
    if (playerId === authUser?._id) return false;
    if (currentGame.voteType === "findSeer" && p.role === "mayor") return false;
    return true;
  });

  const handleVote = () => {
    if (selectedTarget && currentGame && !hasVoted) {
      castVote(currentGame.code, selectedTarget);
      setHasVoted(true);
    }
  };

  // Check if user already voted
  const existingVote = currentGame.votes.find(
    (v) => v.voterId === authUser?._id
  );

  return (
    <div className="min-h-screen bg-base-100 flex flex-col items-center justify-center p-4">
      {/* Header */}
      <div className="text-center mb-8">
        <FaVoteYea className="text-6xl text-primary mx-auto mb-4" />
        <h1 className="text-3xl font-bold">Voting Phase</h1>

        {currentGame.voteType === "findSeer" ? (
          <div className="mt-4 p-4 bg-error/20 rounded-lg max-w-md">
            <div className="flex items-center justify-center gap-2 mb-2">
              <GiWolfHead className="text-2xl text-error" />
              <span className="font-bold text-error">Word was guessed!</span>
            </div>
            <p className="text-sm">
              The Magic Word was: <strong>{currentGame.magicWord}</strong>
            </p>
            <p className="mt-2">
              Werewolves are now voting to identify the Seer.
            </p>
          </div>
        ) : (
          <div className="mt-4 p-4 bg-warning/20 rounded-lg max-w-md">
            <p className="font-bold text-warning">Time ran out!</p>
            <p className="text-sm mt-1">
              The Magic Word was: <strong>{currentGame.magicWord}</strong>
            </p>
            <p className="mt-2">Village is voting to find a Werewolf.</p>
          </div>
        )}
      </div>

      {/* Voting Area */}
      <div className="card bg-base-200 w-full max-w-lg">
        <div className="card-body">
          {canVote ? (
            <>
              {hasVoted || existingVote ? (
                <div className="text-center py-8">
                  <FaCheck className="text-4xl text-success mx-auto mb-4" />
                  <p className="text-xl font-bold">Vote Submitted</p>
                  <p className="text-base-content/60 mt-2">
                    Waiting for other players...
                  </p>
                </div>
              ) : (
                <>
                  <h2 className="card-title justify-center mb-4">
                    {currentGame.voteType === "findSeer"
                      ? "Who is the Seer?"
                      : "Who is a Werewolf?"}
                  </h2>

                  <div className="space-y-2">
                    {votablePlayers.map((player) => {
                      const user = player.user as User;
                      return (
                        <button
                          key={user._id}
                          onClick={() => setSelectedTarget(user._id)}
                          className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                            selectedTarget === user._id
                              ? "bg-primary text-primary-content"
                              : "bg-base-300 hover:bg-base-100"
                          }`}
                        >
                          <Avatar
                            src={user.profilePic}
                            alt={user.fullName}
                            size="md"
                          />
                          <div className="flex-1 text-left">
                            <div className="font-medium">{user.fullName}</div>
                            <div className="text-sm opacity-70">
                              @{user.username}
                            </div>
                          </div>
                          {selectedTarget === user._id && (
                            <FaCheck className="text-xl" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={handleVote}
                    disabled={!selectedTarget}
                    className="btn btn-primary w-full mt-4"
                  >
                    Submit Vote
                  </button>
                </>
              )}
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-xl">
                {currentGame.voteType === "findSeer"
                  ? "Werewolves are voting..."
                  : "Village is voting..."}
              </p>
              <p className="text-base-content/60 mt-2">
                {myRole === "mayor"
                  ? "As Mayor, you don't vote."
                  : "You cannot vote in this round."}
              </p>
              <span className="loading loading-dots loading-lg mt-4"></span>
            </div>
          )}

          {/* Vote Progress */}
          <div className="mt-4 pt-4 border-t border-base-300">
            <p className="text-sm text-center text-base-content/60">
              Votes submitted: {currentGame.votes.length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VotingPhase;
