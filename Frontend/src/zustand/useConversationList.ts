import { create } from "zustand";
import toast from "react-hot-toast";
import type { User, ApiError } from "../types";

interface ConversationListState {
  conversationList: User[];
  loading: boolean;
  lastFetched: number | null;
  setConversationList: (users: User[]) => void;
  fetchConversationList: () => Promise<void>;
  addUser: (user: User) => void;
  removeUser: (userId: string) => void;
}

const useConversationList = create<ConversationListState>((set, get) => ({
  conversationList: [],
  loading: false,
  lastFetched: null,

  setConversationList: (conversationList: User[]) => set({ conversationList }),

  fetchConversationList: async () => {
    set({ loading: true });
    try {
      const res = await fetch("/api/users");
      const data: User[] & ApiError = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }
      set({
        conversationList: data as User[],
        lastFetched: Date.now()
      });
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    } finally {
      set({ loading: false });
    }
  },

  addUser: (user: User) => {
    const { conversationList } = get();
    // Only add if not already in list
    if (!conversationList.find((u) => u._id === user._id)) {
      set({ conversationList: [...conversationList, user] });
    }
  },

  removeUser: (userId: string) => {
    const { conversationList } = get();
    set({ conversationList: conversationList.filter((u) => u._id !== userId) });
  },
}));

export default useConversationList;
