import Message from "./Message";
import useGetMessages from "../../hooks/useGetMessages";
import MessageSkeleton from "../../../skeletons/MessageSkeleton";
import { useEffect, useRef, useMemo } from "react";
import useListenMessages from "../../hooks/useListenMessages";
import { FiMessageCircle } from "react-icons/fi";
import type { Message as MessageType } from "../../types";

// Helper to format date for separators
const formatDateSeparator = (dateString: string): string => {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return "Today";
  } else if (date.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  } else {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
    });
  }
};

// Helper to check if two dates are different days
const isDifferentDay = (date1: string, date2: string): boolean => {
  const d1 = new Date(date1).toDateString();
  const d2 = new Date(date2).toDateString();
  return d1 !== d2;
};

// Date separator component
const DateSeparator = ({ date }: { date: string }) => (
  <div className="flex items-center justify-center my-4">
    <div className="flex-1 h-px bg-base-300/50" />
    <span className="px-4 py-1 text-xs font-medium text-base-content/50 bg-base-200/50 rounded-full mx-2">
      {formatDateSeparator(date)}
    </span>
    <div className="flex-1 h-px bg-base-300/50" />
  </div>
);

const MessageList = () => {
  const { messages, loading } = useGetMessages();
  useListenMessages();
  const lastMessageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTimeout(() => {
      lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, [messages]);

  // Process messages for grouping
  const processedMessages = useMemo(() => {
    return messages.map((message: MessageType, index: number) => {
      const prevMessage = messages[index - 1];
      const nextMessage = messages[index + 1];

      // Check if this is part of a group (same sender, within 2 minutes)
      const isFromSameSenderAsPrev =
        prevMessage &&
        prevMessage.senderId === message.senderId &&
        !isDifferentDay(prevMessage.createdAt, message.createdAt);

      const isFromSameSenderAsNext =
        nextMessage &&
        nextMessage.senderId === message.senderId &&
        !isDifferentDay(message.createdAt, nextMessage.createdAt);

      // Show date separator if first message or different day from previous
      const showDateSeparator =
        index === 0 ||
        (prevMessage && isDifferentDay(prevMessage.createdAt, message.createdAt));

      return {
        message,
        isFirstInGroup: !isFromSameSenderAsPrev,
        isLastInGroup: !isFromSameSenderAsNext,
        showAvatar: !isFromSameSenderAsNext,
        showDateSeparator,
      };
    });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto bg-gradient-to-b from-base-200/20 to-base-200/40 scrollbar-thin scrollbar-thumb-base-300 scrollbar-track-transparent">
      <div className="max-w-4xl mx-auto px-6 py-4">
        {loading && (
          <div className="space-y-4">
            {[...Array(3)].map((_, idx) => (
              <MessageSkeleton key={idx} />
            ))}
          </div>
        )}

        {!loading && messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full py-20">
            <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full flex items-center justify-center mb-5 shadow-inner">
              <FiMessageCircle className="w-10 h-10 text-primary/60" />
            </div>
            <p className="text-base-content/70 text-center font-medium text-lg">
              No messages yet
            </p>
            <p className="text-base-content/40 text-sm mt-2 text-center max-w-xs">
              Send a message to start the conversation
            </p>
          </div>
        )}

        {!loading &&
          messages.length > 0 &&
          processedMessages.map(
            (
              { message, isFirstInGroup, isLastInGroup, showAvatar, showDateSeparator },
              index
            ) => (
              <div
                key={message._id}
                ref={index === messages.length - 1 ? lastMessageRef : null}
                className="animate-in fade-in duration-200"
              >
                {showDateSeparator && <DateSeparator date={message.createdAt} />}
                <Message
                  message={message}
                  showAvatar={showAvatar}
                  isFirstInGroup={isFirstInGroup}
                  isLastInGroup={isLastInGroup}
                />
              </div>
            )
          )}
      </div>
    </div>
  );
};

export default MessageList;
