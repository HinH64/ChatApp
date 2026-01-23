import { useAuthContext } from "../../context/AuthContext";
import useConversation from "../../zustand/useConversation";
import { extractTime } from "../../../utils/extractTime";
import type { Message as MessageType } from "../../types";
import Avatar from "../ui/Avatar";

interface MessageProps {
  message: MessageType;
}

const Message = ({ message }: MessageProps) => {
  const { authUser } = useAuthContext();
  const { selectedConversation } = useConversation();
  const fromMe = message.senderId === authUser?._id;
  const formattedTime = extractTime(message.createdAt);
  const profilePic = fromMe
    ? authUser?.profilePic
    : selectedConversation?.profilePic;
  const shakeClass = message.shouldShake ? "animate-shake" : "";

  const displayName = fromMe
    ? authUser?.fullName || "Me"
    : selectedConversation?.fullName || "User";

  return (
    <div className={`flex items-end gap-2 mb-3 ${fromMe ? "flex-row-reverse" : ""}`}>
      {/* Avatar */}
      <Avatar
        src={profilePic}
        alt={displayName}
        size="sm"
      />

      {/* Message bubble */}
      <div className={`max-w-[70%] ${fromMe ? "items-end" : "items-start"}`}>
        <div
          className={`px-4 py-2.5 rounded-2xl ${shakeClass} ${
            fromMe
              ? "bg-primary text-primary-content rounded-br-md"
              : "bg-base-100 text-base-content rounded-bl-md shadow-sm"
          }`}
        >
          <p className="text-sm whitespace-pre-wrap break-words">{message.message}</p>
        </div>
        <p
          className={`text-xs text-base-content/40 mt-1 px-1 ${
            fromMe ? "text-right" : "text-left"
          }`}
        >
          {formattedTime}
        </p>
      </div>
    </div>
  );
};

export default Message;
