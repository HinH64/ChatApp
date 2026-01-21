import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import { TiMessages } from "react-icons/ti";
import useConversation from "../../zustand/useConversation";
import { useEffect } from "react";
import UserInfo from "../sidebar/UserInfo";

const MessageContainer = () => {
  const { selectedConversation, setSelectedConversation } = useConversation();

  useEffect(() => {
    return () => setSelectedConversation(null);
  }, [setSelectedConversation]);

  return (
    <div className="flex flex-col w-full h-full">
      {!selectedConversation ? (
        <NoChatSelected />
      ) : (
        <>
          <div className="px-4 py-2 bg-base-100">
            <div className="flex gap-2 items-center rounded p-2 py-1">
              <span className="label-text">To:</span>
              <UserInfo userData={selectedConversation} isOnline="" />
            </div>
            <div className="divider px-3"></div>
          </div>
          <MessageList />
          <MessageInput />
        </>
      )}
    </div>
  );
};

export default MessageContainer;

const NoChatSelected = () => {
  return (
    <div className="flex items-center justify-center w-full h-full bg-base-300">
      <div className="px-4 text-center sm:text-lg md:text-xl font-semibold flex flex-col items-center gap-2">
        <p>Select a chat to start messaging</p>
        <TiMessages className="text-3xl md:text-6xl text-center" />
      </div>
    </div>
  );
};
