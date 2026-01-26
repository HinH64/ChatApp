import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import { FiMessageCircle, FiArrowLeft, FiMoreVertical, FiPhone, FiVideo } from "react-icons/fi";
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
          <div className="px-4 py-3 bg-base-100/95 backdrop-blur-sm border-b border-base-200/80 flex items-center gap-3 pl-16 lg:pl-4 shadow-sm sticky top-0 z-10">
            {/* Back button for mobile */}
            <button
              className="lg:hidden btn btn-ghost btn-sm btn-circle hover:bg-base-200"
              onClick={() => setSelectedConversation(null)}
            >
              <FiArrowLeft className="w-5 h-5" />
            </button>

            {/* User info */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <Avatar
                src={selectedConversation.profilePic}
                alt={selectedConversation.fullName}
                size="md"
                showOnlineStatus={true}
                isOnline={isOnline}
              />
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-base truncate">
                  {selectedConversation.fullName}
                </h3>
                <div className="flex items-center gap-1.5">
                  {isOnline ? (
                    <>
                      <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                      <span className="text-xs text-success font-medium">Active now</span>
                    </>
                  ) : (
                    <span className="text-xs text-base-content/50">
                      @{selectedConversation.username}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-1">
              <button className="btn btn-ghost btn-sm btn-circle text-base-content/60 hover:text-primary hover:bg-primary/10">
                <FiPhone className="w-4.5 h-4.5" />
              </button>
              <button className="btn btn-ghost btn-sm btn-circle text-base-content/60 hover:text-primary hover:bg-primary/10">
                <FiVideo className="w-4.5 h-4.5" />
              </button>
              <button className="btn btn-ghost btn-sm btn-circle text-base-content/60 hover:bg-base-200">
                <FiMoreVertical className="w-4.5 h-4.5" />
              </button>
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
    <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-base-100 via-base-200/50 to-base-200">
      <div className="text-center px-8 max-w-md">
        {/* Animated icon */}
        <div className="relative w-28 h-28 mx-auto mb-8">
          <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping opacity-20" />
          <div className="relative w-28 h-28 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full flex items-center justify-center shadow-xl border border-base-200">
            <FiMessageCircle className="w-14 h-14 text-primary" />
          </div>
        </div>

        {/* Welcome message */}
        <h2 className="text-2xl font-bold mb-3 text-base-content">
          Welcome{username ? `, ${username.split(" ")[0]}` : ""}!
        </h2>
        <p className="text-base-content/60 leading-relaxed">
          Select a conversation from the sidebar to start chatting with your friends and family.
        </p>

        {/* Features hint */}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 bg-base-200/60 rounded-full text-xs text-base-content/60">
            <FiMessageCircle className="w-3.5 h-3.5" />
            <span>Real-time messaging</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-base-200/60 rounded-full text-xs text-base-content/60">
            <span className="w-2 h-2 rounded-full bg-success" />
            <span>Online status</span>
          </div>
        </div>

        {/* Hint for mobile */}
        <p className="text-sm text-base-content/40 mt-8 lg:hidden">
          Tap the menu icon to see your conversations
        </p>
      </div>
    </div>
  );
};
