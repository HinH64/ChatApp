import { createContext, useState, useEffect, useContext, ReactNode, useRef } from "react";
import { useAuthContext } from "./AuthContext";
import { io, Socket } from "socket.io-client";
import type { SocketContextType } from "../types";
import useConversationList from "../zustand/useConversationList";

const SocketContext = createContext<SocketContextType | null>(null);

export const useSocketContext = (): SocketContextType => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocketContext must be used within a SocketContextProvider");
  }
  return context;
};

interface SocketContextProviderProps {
  children: ReactNode;
}

export const SocketContextProvider = ({ children }: SocketContextProviderProps) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const { authUser } = useAuthContext();
  const { fetchConversationList, conversationList } = useConversationList();
  const prevOnlineUsersRef = useRef<string[]>([]);

  useEffect(() => {
    if (authUser) {
      const socketUrl = import.meta.env.VITE_SOCKET_URL || "http://localhost:8000";
      const newSocket = io(socketUrl, {
        query: {
          userId: authUser._id,
        },
      });

      setSocket(newSocket);

      newSocket.on("getOnlineUsers", (users: string[]) => {
        setOnlineUsers(users);
      });

      return () => {
        newSocket.close();
      };
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  }, [authUser]);

  // Detect new users coming online that we don't have in our list
  useEffect(() => {
    if (onlineUsers.length > 0 && conversationList.length > 0) {
      const knownUserIds = new Set(conversationList.map((u) => u._id));
      const prevUserIds = new Set(prevOnlineUsersRef.current);

      // Check if there's a new online user we don't know about
      const hasNewUnknownUser = onlineUsers.some(
        (userId) => !knownUserIds.has(userId) && !prevUserIds.has(userId) && userId !== authUser?._id
      );

      if (hasNewUnknownUser) {
        // Refresh the conversation list to get the new user
        fetchConversationList();
      }
    }
    prevOnlineUsersRef.current = onlineUsers;
  }, [onlineUsers, conversationList, authUser?._id, fetchConversationList]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};
