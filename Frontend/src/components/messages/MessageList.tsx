import Message from "./Message";
import useGetMessages from "../../hooks/useGetMessages";
import MessageSkeleton from "../../../skeletons/MessageSkeleton";
import { useEffect, useRef } from "react";
import useListenMessages from "../../hooks/useListenMessages";
import { FiSend } from "react-icons/fi";

const MessageList = () => {
  const { messages, loading } = useGetMessages();
  useListenMessages();
  const lastMessageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTimeout(() => {
      lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto bg-base-200/30">
      <div className="px-4 py-4 space-y-1">
        {loading && (
          <div className="space-y-4">
            {[...Array(3)].map((_, idx) => (
              <MessageSkeleton key={idx} />
            ))}
          </div>
        )}

        {!loading && messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full py-20">
            <div className="w-16 h-16 bg-base-200 rounded-full flex items-center justify-center mb-4">
              <FiSend className="w-8 h-8 text-base-content/40" />
            </div>
            <p className="text-base-content/60 text-center">
              No messages yet
            </p>
            <p className="text-base-content/40 text-sm mt-1">
              Send a message to start the conversation
            </p>
          </div>
        )}

        {!loading &&
          messages.length > 0 &&
          messages.map((message, index) => (
            <div
              key={message._id}
              ref={index === messages.length - 1 ? lastMessageRef : null}
            >
              <Message message={message} />
            </div>
          ))}
      </div>
    </div>
  );
};

export default MessageList;
