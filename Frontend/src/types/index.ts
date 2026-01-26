import type { Socket } from "socket.io-client";

export type UserRole = "user" | "admin";

export interface User {
  _id: string;
  fullName: string;
  username: string;
  profilePic: string;
  gender?: "male" | "female";
  role: UserRole;
  email?: string;
  bio?: string;
  lastSeen?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateProfileInputs {
  fullName?: string;
  email?: string;
  bio?: string;
  gender?: "male" | "female";
}

export interface ChangePasswordInputs {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
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

export type RightPanelView = "chat" | "game" | "admin";

export interface RightPanelState {
  currentView: RightPanelView;
  setCurrentView: (view: RightPanelView) => void;
}

export interface SignupInputs {
  fullName: string;
  username: string;
  password: string;
  confirmPassword: string;
  gender?: string;
}

export interface ApiError {
  error?: string;
}

export interface ThemeContextType {
  theme: "light" | "dark";
  toggleTheme: () => void;
}

// Game Types for Werewords
export type GameRole = "mayor" | "seer" | "werewolf" | "villager";
export type GameStatus = "lobby" | "night" | "day" | "voting" | "ended";
export type TokenType = "yes" | "no" | "maybe" | "soClose";
export type VoteType = "findSeer" | "findWerewolf";
export type GameWinner = "village" | "werewolf";

export interface TokenCounts {
  yes: number;
  no: number;
  maybe: number;
  soClose: number;
}

export interface GameSettings {
  dayDuration: number;
  tokenCounts: TokenCounts;
  wordCategory: string;
  difficulty: "easy" | "medium" | "hard";
}

export interface GamePlayer {
  user: User;
  role: GameRole | null;
  isConnected: boolean;
}

export interface TokenUsage {
  questionIndex: number;
  token: TokenType;
  timestamp: string;
}

export interface GameQuestion {
  playerId: User;
  text: string;
  response: TokenType | null;
  isGuess: boolean;
  timestamp: string;
}

export interface GameVote {
  voterId: string;
  targetId: string;
  timestamp: string;
}

export interface Game {
  _id: string;
  code: string;
  host: User;
  players: GamePlayer[];
  status: GameStatus;
  magicWord: string | null;
  wordOptions: string[];
  tokens: TokenCounts;
  tokensUsed: TokenUsage[];
  questions: GameQuestion[];
  wordGuessed: boolean;
  guessedBy: string | null;
  votes: GameVote[];
  voteType: VoteType | null;
  winner: GameWinner | null;
  settings: GameSettings;
  dayStartTime: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface GameContextType {
  currentGame: Game | null;
  setCurrentGame: (
    game: Game | null | ((prev: Game | null) => Game | null)
  ) => void;
  myRole: GameRole | null;
  setMyRole: (role: GameRole | null) => void;
  isHost: boolean;
}
