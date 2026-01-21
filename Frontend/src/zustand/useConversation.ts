import { create } from "zustand";
import type { User, Message, ConversationState } from "../types";

const useConversation = create<ConversationState>((set) => ({
  selectedConversation: null,
  setSelectedConversation: (selectedConversation: User | null) =>
    set({ selectedConversation }),
  messages: [],
  setMessages: (messages: Message[]) => set({ messages }),
}));

export default useConversation;
