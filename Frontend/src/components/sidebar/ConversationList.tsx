import Conversation from "./Conversation";
import useGetConversationList from "../../hooks/useGetConversationList";
import { FiUsers } from "react-icons/fi";

const ConversationList = () => {
  const { loading, conversationList } = useGetConversationList();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <span className="loading loading-spinner loading-md text-primary"></span>
      </div>
    );
  }

  if (conversationList.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <div className="w-16 h-16 bg-base-200 rounded-full flex items-center justify-center mb-4">
          <FiUsers className="w-8 h-8 text-base-content/40" />
        </div>
        <p className="text-base-content/60 text-sm">No conversations yet</p>
        <p className="text-base-content/40 text-xs mt-1">
          Start chatting with someone!
        </p>
      </div>
    );
  }

  return (
    <div className="px-2 overflow-y-auto h-full">
      <div className="space-y-1">
        {conversationList.map((conversation) => (
          <Conversation key={conversation._id} conversation={conversation} />
        ))}
      </div>
    </div>
  );
};

export default ConversationList;
