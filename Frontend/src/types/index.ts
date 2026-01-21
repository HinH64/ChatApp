import type { Socket } from "socket.io-client";

export interface User {
  _id: string;
  fullName: string;
  username: string;
  profilePic: string;
  gender: "male" | "female";
  createdAt?: string;
  updatedAt?: string;
}

export interface Message {
  _id: string;
  senderId: string;
  receiverId: string;
  message: string;
  createdAt: string;
  updatedAt?: string;
  shouldShake?: boolean;
}

export interface Conversation {
  _id: string;
  participants: string[];
  messages: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthContextType {
  authUser: User | null;
  setAuthUser: React.Dispatch<React.SetStateAction<User | null>>;
}

export interface SocketContextType {
  socket: Socket | null;
  onlineUsers: string[];
}

export interface ConversationState {
  selectedConversation: User | null;
  setSelectedConversation: (conversation: User | null) => void;
  messages: Message[];
  setMessages: (messages: Message[]) => void;
}

export interface SignupInputs {
  fullName: string;
  username: string;
  password: string;
  confirmPassword: string;
  gender: string;
}

export interface ApiError {
  error?: string;
}
