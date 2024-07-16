import Conversation from "./Conversation"
import useGetConversationList from "../../hooks/useGetConversationList";

const ConversationList = () => {
  const { loading, conversationList } = useGetConversationList();
  return (
    <div className='py-2 flex flex-col overflow-auto'>
     {conversationList.map((conversation, idx) => (
				<Conversation
					key={conversation._id}
					conversation={conversation}
					lastIdx={idx === conversationList.length - 1}
				/>
			))}
      {loading ? <span className='loading loading-spinner mx-auto'></span> : null}
    </div>
  )
}

export default ConversationList