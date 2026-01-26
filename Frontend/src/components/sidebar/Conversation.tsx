import useConversation from "../../zustand/useConversation";
import useRightPanel from "../../zustand/useRightPanel";
import { useSocketContext } from "../../context/SocketContext";
import type { User } from "../../types";
import { formatLastSeen } from "../../utils/formatLastSeen";
import Avatar from "../ui/Avatar";

interface ConversationProps {
  conversation: User;
}

const Conversation = ({ conversation }: ConversationProps) => {
  const { selectedConversation, setSelectedConversation } = useConversation();
  const { setCurrentView } = useRightPanel();
  const isSelected = selectedConversation?._id === conversation._id;
  const { onlineUsers } = useSocketContext();
  const isOnline = onlineUsers.includes(conversation._id);

  const handleSelect = () => {
    setSelectedConversation(conversation);
    setCurrentView("chat");
  };

  return (
    <div
      className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 ${
        isSelected
          ? "bg-primary/15 border border-primary/30"
          : "hover:bg-base-200/80 border border-transparent"
      }`}
      onClick={handleSelect}
    >
      {/* Avatar */}
      <Avatar
        src={conversation.profilePic}
        alt={conversation.fullName}
        size="md"
        showOnlineStatus={isOnline}
        isOnline={isOnline}
      />

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className="font-semibold truncate">{conversation.fullName}</p>
          <span className="text-xs text-base-content/50 flex-shrink-0">
            {isOnline ? (
              <span className="text-success font-medium">Online</span>
            ) : (
              conversation.lastSeen && formatLastSeen(conversation.lastSeen)
            )}
          </span>
        </div>
        {conversation.bio ? (
          <p className="text-sm text-base-content/60 truncate">{conversation.bio}</p>
        ) : (
          <p className="text-sm text-base-content/40 truncate">@{conversation.username}</p>
        )}
      </div>
    </div>
  );
};

export default Conversation;
