import useConversation from "../../zustand/useConversation";
import { useSocketContext } from "../../context/SocketContext";
import UserInfo from "./UserInfo";
import type { User } from "../../types";

interface ConversationProps {
  conversation: User;
  lastIdx: boolean;
}

const Conversation = ({ conversation, lastIdx }: ConversationProps) => {
  const { selectedConversation, setSelectedConversation } = useConversation();
  const isSelected = selectedConversation?._id === conversation._id;
  const { onlineUsers } = useSocketContext();
  const isOnline = onlineUsers.includes(conversation._id);

  return (
    <>
      <div
        className={`flex gap-2 items-center hover:bg-sky-500 rounded p-2 py-1 cursor-pointer
        ${isSelected ? "bg-sky-500" : ""}
      `}
        onClick={() => setSelectedConversation(conversation)}
      >
        <UserInfo userData={conversation} isOnline={isOnline} />
        {!lastIdx && <div className="divider my-0 py-0 h-1" />}
      </div>
    </>
  );
};

export default Conversation;
