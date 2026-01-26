import { useAuthContext } from "../../context/AuthContext";
import useConversation from "../../zustand/useConversation";
import { extractTime } from "../../../utils/extractTime";
import type { Message as MessageType } from "../../types";
import Avatar from "../ui/Avatar";

interface MessageProps {
  message: MessageType;
  showAvatar?: boolean;
  isFirstInGroup?: boolean;
  isLastInGroup?: boolean;
}

const Message = ({
  message,
  showAvatar = true,
  isFirstInGroup = true,
  isLastInGroup = true
}: MessageProps) => {
  const { authUser } = useAuthContext();
  const { selectedConversation } = useConversation();
  const fromMe = message.senderId === authUser?._id;
  const formattedTime = extractTime(message.createdAt);
  const profilePic = selectedConversation?.profilePic;
  const shakeClass = message.shouldShake ? "shake" : "";

  const displayName = selectedConversation?.fullName || "User";

  return (
    <div className={isLastInGroup ? "mb-4" : "mb-1"}>
      {/* Name and timestamp - show on first message in group */}
      {isFirstInGroup && (
        <div className={`flex items-center gap-2 mb-1 ${fromMe ? "justify-end pr-1" : "pl-10"}`}>
          {!fromMe && (
            <span className="text-xs font-medium text-base-content/70">
              {displayName}
            </span>
          )}
          <span className="text-xs text-base-content/40">
            {formattedTime}
          </span>
        </div>
      )}

      {/* Message row with avatar */}
      <div className={`flex items-end gap-2 ${fromMe ? "justify-end" : ""}`}>
        {/* Avatar - only show for received messages */}
        {!fromMe && (
          <div className={`w-8 flex-shrink-0 ${isFirstInGroup ? "" : "invisible"}`}>
            <Avatar
              src={profilePic}
              alt={displayName}
              size="sm"
            />
          </div>
        )}

        {/* Message bubble */}
        <div
          className={`inline-block px-3 py-2 rounded-lg ${shakeClass} ${
            fromMe
              ? "bg-primary text-primary-content"
              : "bg-base-200/80 text-base-content"
          }`}
          style={{ maxWidth: "70%" }}
        >
          <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">
            {message.message}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Message;
