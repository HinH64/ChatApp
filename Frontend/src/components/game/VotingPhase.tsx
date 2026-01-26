import { useState } from "react";
import {
  FaVoteYea,
  FaCheck,
  FaTimes,
  FaQuestion,
  FaFire,
  FaChevronDown,
  FaChevronUp,
  FaEye,
  FaUser,
} from "react-icons/fa";
import { GiWolfHead, GiVillage } from "react-icons/gi";
import { useGameContext } from "../../context/GameContext";
import { useAuthContext } from "../../context/AuthContext";
import useGameSocket from "../../hooks/game/useGameSocket";
import ExitGameButton from "./ExitGameButton";
import type { User, TokenType, GameQuestion, GameRole } from "../../types";
import Avatar from "../ui/Avatar";

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

const roleIcons: Record<GameRole, React.ReactNode> = {
  mayor: <FaUser className="text-primary" />,
  seer: <FaEye className="text-info" />,
  werewolf: <GiWolfHead className="text-error" />,
  villager: <FaUser className="text-success" />,
};

const VotingPhase = () => {
  const { currentGame, myRole } = useGameContext();
  const { authUser } = useAuthContext();
  const { castVote } = useGameSocket();
  const [selectedTarget, setSelectedTarget] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  if (!currentGame) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  const isFindSeer = currentGame.voteType === "findSeer";

  // Determine if current player can vote
  const canVote =
    (isFindSeer && myRole === "werewolf") ||
    (!isFindSeer && myRole !== "werewolf");

  // Get votable players (exclude self and mayor for findSeer)
  const votablePlayers = currentGame.players.filter((p) => {
    const playerId = (p.user as User)._id;
    if (playerId === authUser?._id) return false;
    if (isFindSeer && p.role === "mayor") return false;
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

  // Calculate vote progress
  const eligibleVoters = currentGame.players.filter((p) =>
    isFindSeer ? p.role === "werewolf" : p.role !== "werewolf"
  ).length;

  return (
    <div className="min-h-screen bg-base-100 flex flex-col items-center p-4 relative overflow-y-auto">
      {/* Exit Button */}
      <div className="absolute top-4 right-4 z-10">
        <ExitGameButton />
      </div>

      {/* Header Banner */}
      <div
        className={`w-full max-w-lg text-center p-8 rounded-2xl mb-6 mt-8 ${
          isFindSeer ? "bg-error/20" : "bg-warning/20"
        }`}
      >
        <div className="mb-4">
          {isFindSeer ? (
            <GiWolfHead className="text-7xl text-error mx-auto" />
          ) : (
            <GiVillage className="text-7xl text-warning mx-auto" />
          )}
        </div>
        <h1 className="text-3xl font-bold mb-2">
          {isFindSeer ? "Word Guessed!" : "Time's Up!"}
        </h1>
        <p className="text-base-content/70">
          {isFindSeer
            ? "Werewolves must identify the Seer to win!"
            : "Village must find a Werewolf to win!"}
        </p>
      </div>

      {/* Magic Word Card */}
      <div className="card bg-base-200 w-full max-w-lg mb-4">
        <div className="card-body items-center text-center py-4">
          <p className="text-sm text-base-content/60">The Magic Word was:</p>
          <p className="text-2xl font-bold text-primary">
            {currentGame.magicWord}
          </p>
        </div>
      </div>

      {/* Your Role Indicator */}
      <div className="card bg-base-200 w-full max-w-lg mb-4">
        <div className="card-body py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-2xl">{myRole && roleIcons[myRole]}</div>
              <div>
                <p className="text-sm text-base-content/60">Your Role</p>
                <p className="font-bold capitalize">{myRole}</p>
              </div>
            </div>
            <div
              className={`badge ${canVote ? "badge-primary" : "badge-ghost"} badge-lg`}
            >
              {canVote ? "You can vote" : "Spectating"}
            </div>
          </div>
        </div>
      </div>

      {/* Voting Area */}
      <div className="card bg-base-200 w-full max-w-lg mb-4">
        <div className="card-body">
          <h2 className="card-title justify-center mb-2">
            <FaVoteYea className="text-primary" />
            {isFindSeer ? "Find the Seer" : "Find a Werewolf"}
          </h2>

          {canVote ? (
            <>
              {hasVoted || existingVote ? (
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaCheck className="text-3xl text-success" />
                  </div>
                  <p className="text-xl font-bold">Vote Submitted!</p>
                  <p className="text-base-content/60 mt-2">
                    Waiting for other players...
                  </p>
                </div>
              ) : (
                <>
                  <p className="text-center text-base-content/60 mb-4">
                    Select a player to vote for:
                  </p>

                  <div className="space-y-2">
                    {votablePlayers.map((player) => {
                      const user = player.user as User;
                      const isSelected = selectedTarget === user._id;
                      return (
                        <button
                          key={user._id}
                          onClick={() => setSelectedTarget(user._id)}
                          className={`w-full flex items-center gap-3 p-4 rounded-xl transition-all ${
                            isSelected
                              ? "bg-primary text-primary-content ring-2 ring-primary ring-offset-2 ring-offset-base-200"
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
                          {isSelected && (
                            <div className="w-8 h-8 bg-primary-content/20 rounded-full flex items-center justify-center">
                              <FaCheck className="text-lg" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={handleVote}
                    disabled={!selectedTarget}
                    className="btn btn-primary btn-lg w-full mt-4 gap-2"
                  >
                    <FaVoteYea />
                    Submit Vote
                  </button>
                </>
              )}
            </>
          ) : (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-base-300 rounded-full flex items-center justify-center mx-auto mb-4">
                {isFindSeer ? (
                  <GiWolfHead className="text-3xl text-error" />
                ) : (
                  <GiVillage className="text-3xl text-warning" />
                )}
              </div>
              <p className="text-xl font-medium">
                {isFindSeer ? "Werewolves are voting..." : "Village is voting..."}
              </p>
              <p className="text-base-content/60 mt-2">
                {myRole === "mayor"
                  ? "As Mayor, you observe the voting."
                  : myRole === "werewolf"
                  ? "You cannot vote in this round."
                  : "Werewolves cannot vote in this round."}
              </p>
              <span className="loading loading-dots loading-lg mt-4"></span>
            </div>
          )}

          {/* Vote Progress */}
          <div className="mt-4 pt-4 border-t border-base-300">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-base-content/60">Voting Progress</span>
              <span className="font-medium">
                {currentGame.votes.length} / {eligibleVoters}
              </span>
            </div>
            <progress
              className="progress progress-primary w-full"
              value={currentGame.votes.length}
              max={eligibleVoters}
            ></progress>
          </div>
        </div>
      </div>

      {/* Questions History */}
      {currentGame.questions.length > 0 && (
        <div className="card bg-base-200 w-full max-w-lg mb-4">
          <div className="card-body p-4">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="flex items-center justify-between w-full hover:opacity-80 transition-opacity"
            >
              <h3 className="font-bold flex items-center gap-2">
                <FaQuestion className="text-primary" />
                Questions History ({currentGame.questions.length})
              </h3>
              <div className="btn btn-ghost btn-sm btn-circle">
                {showHistory ? <FaChevronUp /> : <FaChevronDown />}
              </div>
            </button>

            {showHistory && (
              <div className="mt-4 space-y-3 max-h-72 overflow-y-auto pr-1">
                {currentGame.questions.map((q, index) => (
                  <QuestionHistoryItem key={index} question={q} />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Read-only question history item
const QuestionHistoryItem = ({ question }: { question: GameQuestion }) => {
  const player = question.playerId as User;

  return (
    <div
      className={`p-3 rounded-xl ${
        question.isGuess
          ? "bg-primary/20 border border-primary/50"
          : "bg-base-300"
      }`}
    >
      <div className="flex items-start gap-3">
        <Avatar src={player.profilePic} alt={player.fullName} size="sm" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-sm">{player.fullName}</span>
            {question.isGuess && (
              <span className="badge badge-primary badge-xs">GUESS</span>
            )}
          </div>
          <p className="text-sm mt-1">{question.text}</p>
        </div>

        {/* Response */}
        {question.response && (
          <div className="flex items-center gap-1.5 bg-base-100 px-2 py-1 rounded-lg shrink-0">
            {tokenIcons[question.response]}
            <span className="font-medium text-sm">
              {tokenLabels[question.response]}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default VotingPhase;
