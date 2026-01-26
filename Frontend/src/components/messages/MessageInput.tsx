import { useState, FormEvent, useRef, KeyboardEvent } from "react";
import { FiSend } from "react-icons/fi";
import useSendMessage from "../../hooks/useSendMessage";

const MessageInput = () => {
  const [message, setMessage] = useState("");
  const { loading, sendMessage } = useSendMessage();
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!message.trim() || loading) return;
    await sendMessage(message);
    setMessage("");
    // Reset textarea height
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (message.trim() && !loading) {
        sendMessage(message).then(() => {
          setMessage("");
          if (inputRef.current) {
            inputRef.current.style.height = "auto";
          }
        });
      }
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    // Auto-resize textarea
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 120)}px`;
    }
  };

  return (
    <form
      className="px-4 py-3 bg-base-100 border-t border-base-200/80"
      onSubmit={handleSubmit}
    >
      <div className="max-w-4xl mx-auto flex items-center gap-3">
        {/* Input container */}
        <div className="flex-1">
          <textarea
            ref={inputRef}
            className="w-full min-h-[44px] max-h-[120px] py-2.5 px-4 bg-base-200/60 border border-base-300/50 rounded-2xl resize-none focus:outline-none focus:border-primary/50 focus:bg-base-100 focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-base-content/40 overflow-hidden"
            placeholder="Type a message..."
            value={message}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            rows={1}
            style={{ fontSize: "15px", lineHeight: "1.5" }}
          />
        </div>

        {/* Send button */}
        <button
          type="submit"
          className={`btn btn-circle h-11 w-11 shrink-0 transition-all duration-200 ${
            message.trim()
              ? "btn-primary shadow-md hover:shadow-lg hover:scale-105"
              : "btn-ghost bg-base-200/60 hover:bg-base-200"
          }`}
          disabled={!message.trim() || loading}
        >
          {loading ? (
            <span className="loading loading-spinner loading-sm" />
          ) : (
            <FiSend
              className={`w-5 h-5 ${
                message.trim() ? "" : "text-base-content/40"
              }`}
            />
          )}
        </button>
      </div>
    </form>
  );
};

export default MessageInput;
