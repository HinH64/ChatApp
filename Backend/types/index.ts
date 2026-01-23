import { Request } from "express";
import { Document, Types } from "mongoose";

export interface IUser extends Document {
  _id: Types.ObjectId;
  fullName: string;
  username: string;
  password: string;
  gender: "male" | "female";
  profilePic: string;
  email?: string;
  bio: string;
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
