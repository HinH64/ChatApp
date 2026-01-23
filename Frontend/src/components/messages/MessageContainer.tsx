import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import { FiMessageCircle, FiArrowLeft } from "react-icons/fi";
import useConversation from "../../zustand/useConversation";
import { useSocketContext } from "../../context/SocketContext";
import { useAuthContext } from "../../context/AuthContext";
import { useEffect } from "react";
import Avatar from "../ui/Avatar";

const MessageContainer = () => {
  const { selectedConversation, setSelectedConversation } = useConversation();
  const { onlineUsers } = useSocketContext();
  const { authUser } = useAuthContext();
  const isOnline = selectedConversation
    ? onlineUsers.includes(selectedConversation._id)
    : false;

  useEffect(() => {
    return () => setSelectedConversation(null);
  }, [setSelectedConversation]);

  return (
    <div className="flex flex-col w-full h-full bg-base-100">
      {!selectedConversation ? (
        <NoChatSelected username={authUser?.fullName} />
      ) : (
        <>
          {/* Chat Header */}
          <div className="px-4 py-3 bg-base-100 border-b border-base-200 flex items-center gap-4 pl-16 lg:pl-4">
            {/* Back button for mobile */}
            <button
              className="lg:hidden btn btn-ghost btn-sm btn-circle"
              onClick={() => setSelectedConversation(null)}
            >
              <FiArrowLeft className="w-5 h-5" />
            </button>

            {/* User info */}
            <div className="flex items-center gap-3 flex-1">
              <Avatar
                src={selectedConversation.profilePic}
                alt={selectedConversation.fullName}
                size="md"
                showOnlineStatus={isOnline}
                isOnline={isOnline}
              />
              <div>
                <h3 className="font-semibold">{selectedConversation.fullName}</h3>
                <p className="text-xs text-base-content/60">
                  {isOnline ? (
                    <span className="text-success">Online</span>
                  ) : (
                    `@${selectedConversation.username}`
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <MessageList />

          {/* Input */}
          <MessageInput />
        </>
      )}
    </div>
  );
};

export default MessageContainer;

interface NoChatSelectedProps {
  username?: string;
}

const NoChatSelected = ({ username }: NoChatSelectedProps) => {
  return (
    <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-base-200 to-base-300">
      <div className="text-center px-8">
        {/* Icon */}
        <div className="w-24 h-24 bg-base-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
          <FiMessageCircle className="w-12 h-12 text-primary" />
        </div>

        {/* Welcome message */}
        <h2 className="text-2xl font-bold mb-2">
          Welcome{username ? `, ${username.split(" ")[0]}` : ""}!
        </h2>
        <p className="text-base-content/60 max-w-sm mx-auto">
          Select a conversation from the sidebar to start chatting with your friends.
        </p>

        {/* Hint for mobile */}
        <p className="text-sm text-base-content/40 mt-6 lg:hidden">
          Tap the menu icon to see your conversations
        </p>
      </div>
    </div>
  );
};
