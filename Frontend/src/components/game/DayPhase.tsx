import { useState, useEffect, useRef } from "react";
import {
  FaSun,
  FaCheck,
  FaTimes,
  FaQuestion,
  FaFire,
  FaPaperPlane,
} from "react-icons/fa";
import { useGameContext } from "../../context/GameContext";
import useGameSocket from "../../hooks/game/useGameSocket";
import type { TokenType, GameQuestion, User } from "../../types";
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

const DayPhase = () => {
  const { currentGame, myRole, isHost } = useGameContext();
  const { askQuestion, respondWithToken, triggerTimeUp } = useGameSocket();

  const [questionText, setQuestionText] = useState("");
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Calculate time remaining
  useEffect(() => {
    if (!currentGame?.dayStartTime) return;

    const dayDuration = currentGame.settings.dayDuration * 1000;
    const startTime = new Date(currentGame.dayStartTime).getTime();

    const updateTimer = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const remaining = Math.max(0, dayDuration - elapsed);

      setTimeRemaining(Math.ceil(remaining / 1000));

      if (remaining <= 0 && isHost) {
        triggerTimeUp(currentGame.code);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [currentGame?.dayStartTime, currentGame?.settings.dayDuration, isHost]);

  // Scroll to bottom when new questions arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentGame?.questions.length]);

  if (!currentGame) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  const handleAskQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (questionText.trim() && myRole !== "mayor") {
      askQuestion(currentGame.code, questionText.trim());
      setQuestionText("");
    }
  };

  const handleTokenResponse = (questionIndex: number, token: TokenType) => {
    if (myRole === "mayor" && currentGame.tokens[token] > 0) {
      respondWithToken(currentGame.code, questionIndex, token);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const isMayor = myRole === "mayor";

  return (
    <div className="min-h-screen bg-base-100 flex flex-col">
      {/* Header */}
      <div className="bg-base-200 p-4 shadow-md">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FaSun className="text-2xl text-yellow-500" />
            <h1 className="text-xl font-bold">Day Phase</h1>
          </div>

          {/* Timer */}
          <div
            className={`text-2xl font-mono font-bold ${
              timeRemaining && timeRemaining < 30 ? "text-error animate-pulse" : ""
            }`}
          >
            {timeRemaining !== null ? formatTime(timeRemaining) : "--:--"}
          </div>

          {/* Token Counts */}
          <div className="flex gap-2">
            <div
              className="badge badge-success gap-1"
              title={`${currentGame.tokens.yes} Yes tokens`}
            >
              <FaCheck /> {currentGame.tokens.yes}
            </div>
            <div
              className="badge badge-error gap-1"
              title={`${currentGame.tokens.no} No tokens`}
            >
              <FaTimes /> {currentGame.tokens.no}
            </div>
            <div
              className="badge badge-warning gap-1"
              title={`${currentGame.tokens.maybe} Maybe tokens`}
            >
              <FaQuestion /> {currentGame.tokens.maybe}
            </div>
            <div
              className="badge badge-info gap-1"
              title={`${currentGame.tokens.soClose} So Close tokens`}
            >
              <FaFire /> {currentGame.tokens.soClose}
            </div>
          </div>
        </div>
      </div>

      {/* Role Info Bar */}
      <div className="bg-base-300 p-2 text-center text-sm">
        You are the <span className="font-bold capitalize">{myRole}</span>
        {(myRole === "seer" || myRole === "werewolf" || myRole === "mayor") &&
          currentGame.magicWord && (
            <span>
              {" "}
              - Magic Word:{" "}
              <span className="font-bold text-primary">
                {currentGame.magicWord}
              </span>
            </span>
          )}
      </div>

      {/* Questions List */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto space-y-3">
          {currentGame.questions.length === 0 ? (
            <div className="text-center text-base-content/60 py-8">
              {isMayor
                ? "Waiting for players to ask questions..."
                : "Start asking yes/no questions to guess the Magic Word!"}
            </div>
          ) : (
            currentGame.questions.map((q, index) => (
              <QuestionItem
                key={index}
                question={q}
                index={index}
                isMayor={isMayor}
                tokens={currentGame.tokens}
                onRespond={handleTokenResponse}
              />
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      {!isMayor && (
        <div className="bg-base-200 p-4">
          <form
            onSubmit={handleAskQuestion}
            className="max-w-4xl mx-auto flex gap-2"
          >
            <input
              type="text"
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              placeholder="Ask a yes/no question or type the word to guess..."
              className="input input-bordered flex-1"
            />
            <button
              type="submit"
              disabled={!questionText.trim()}
              className="btn btn-primary"
            >
              <FaPaperPlane />
            </button>
          </form>
        </div>
      )}

      {isMayor && (
        <div className="bg-base-200 p-4 text-center text-base-content/60">
          You are the Mayor. Respond to questions using the token buttons.
        </div>
      )}
    </div>
  );
};

interface QuestionItemProps {
  question: GameQuestion;
  index: number;
  isMayor: boolean;
  tokens: { yes: number; no: number; maybe: number; soClose: number };
  onRespond: (index: number, token: TokenType) => void;
}

const QuestionItem = ({
  question,
  index,
  isMayor,
  tokens,
  onRespond,
}: QuestionItemProps) => {
  const player = question.playerId as User;

  return (
    <div
      className={`p-4 rounded-lg ${
        question.isGuess ? "bg-primary/20 border-2 border-primary" : "bg-base-200"
      }`}
    >
      <div className="flex items-start gap-3">
        <Avatar
          src={player.profilePic}
          alt={player.fullName}
          size="sm"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium">{player.fullName}</span>
            {question.isGuess && (
              <span className="badge badge-primary badge-sm">GUESS</span>
            )}
          </div>
          <p className="text-lg">{question.text}</p>
        </div>

        {/* Response or Response Buttons */}
        <div className="flex items-center gap-2">
          {question.response ? (
            <div className="flex items-center gap-2 text-xl">
              {tokenIcons[question.response]}
              <span className="font-bold">{tokenLabels[question.response]}</span>
            </div>
          ) : isMayor ? (
            <div className="flex gap-1">
              {(["yes", "no", "maybe", "soClose"] as TokenType[]).map((token) => (
                <button
                  key={token}
                  onClick={() => onRespond(index, token)}
                  disabled={tokens[token] <= 0}
                  className={`btn btn-sm ${
                    tokens[token] <= 0 ? "btn-disabled" : ""
                  }`}
                  title={`${tokenLabels[token]} (${tokens[token]} left)`}
                >
                  {tokenIcons[token]}
                </button>
              ))}
            </div>
          ) : (
            <span className="text-base-content/40 text-sm">
              Waiting for Mayor...
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default DayPhase;
