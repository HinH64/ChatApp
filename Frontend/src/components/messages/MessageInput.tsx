import { useState, FormEvent } from "react";
import { FiSend } from "react-icons/fi";
import useSendMessage from "../../hooks/useSendMessage";

const MessageInput = () => {
  const [message, setMessage] = useState("");
  const { loading, sendMessage } = useSendMessage();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!message.trim()) return;
    await sendMessage(message);
    setMessage("");
  };

  return (
    <form
      className="px-4 py-4 bg-base-100 border-t border-base-200"
      onSubmit={handleSubmit}
    >
      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <input
            type="text"
            className="input input-bordered w-full h-12 pr-4 pl-4 bg-base-200/50 border-base-300 focus:border-primary focus:bg-base-100 transition-all rounded-xl"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            style={{ fontSize: "16px" }}
          />
        </div>
        <button
          type="submit"
          className={`btn btn-circle h-12 w-12 shrink-0 ${
            message.trim()
              ? "btn-primary shadow-md"
              : "btn-ghost bg-base-200"
          }`}
          disabled={!message.trim() || loading}
        >
          {loading ? (
            <span className="loading loading-spinner loading-sm" />
          ) : (
            <FiSend className={`w-5 h-5 ${message.trim() ? "" : "text-base-content/40"}`} />
          )}
        </button>
      </div>
    </form>
  );
};

export default MessageInput;
