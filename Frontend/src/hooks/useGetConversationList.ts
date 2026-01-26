import { useEffect } from "react";
import useConversationList from "../zustand/useConversationList";

const useGetConversationList = () => {
  const { loading, conversationList, fetchConversationList, lastFetched } = useConversationList();

  useEffect(() => {
    // Fetch if we haven't fetched yet
    if (lastFetched === null) {
      fetchConversationList();
    }
  }, [lastFetched, fetchConversationList]);

  return { loading, conversationList, refetch: fetchConversationList };
};

export default useGetConversationList;
