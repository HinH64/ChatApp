import { Request } from "express";
import { Document, Types } from "mongoose";

export type UserRole = "user" | "admin";

export interface IUser extends Document {
  _id: Types.ObjectId;
  fullName: string;
  username: string;
  password: string;
  gender: "male" | "female";
  profilePic: string;
  email?: string;
  bio: string;
  role: UserRole;
  lastSeen: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdateProfileBody {
  fullName?: string;
  email?: string;
  bio?: string;
  gender?: "male" | "female";
}

export interface ChangePasswordBody {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface IMessage extends Document {
  _id: Types.ObjectId;
  senderId: Types.ObjectId;
  receiverId: Types.ObjectId;
  message: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IConversation extends Document {
  _id: Types.ObjectId;
  participants: Types.ObjectId[];
  messages: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthenticatedRequest extends Request {
  user?: IUser;
}

export interface JwtPayload {
  userId: string;
}

export interface SignupBody {
  fullName: string;
  username: string;
  password: string;
  confirmPassword: string;
  gender: "male" | "female";
}

export interface LoginBody {
  username: string;
  password: string;
}

export interface SendMessageBody {
  message: string;
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
  user: Types.ObjectId;
  role: GameRole | null;
  isConnected: boolean;
}

export interface TokenUsage {
  questionIndex: number;
  token: TokenType;
  timestamp: Date;
}

export interface Question {
  playerId: Types.ObjectId;
  text: string;
  response: TokenType | null;
  isGuess: boolean;
  timestamp: Date;
}

export interface Vote {
  voterId: Types.ObjectId;
  targetId: Types.ObjectId;
  timestamp: Date;
}

export interface IGame extends Document {
  _id: Types.ObjectId;
  code: string;
  host: Types.ObjectId;
  players: GamePlayer[];
  status: GameStatus;
  magicWord: string | null;
  wordOptions: string[];
  tokens: TokenCounts;
  tokensUsed: TokenUsage[];
  questions: Question[];
  wordGuessed: boolean;
  guessedBy: Types.ObjectId | null;
  votes: Vote[];
  voteType: VoteType | null;
  winner: GameWinner | null;
  settings: GameSettings;
  dayStartTime: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateGameBody {
  settings?: Partial<GameSettings>;
}

export interface JoinGameBody {
  code: string;
}
