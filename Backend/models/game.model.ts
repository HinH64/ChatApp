import mongoose, { Schema } from "mongoose";
import type { IGame } from "../types/index.js";

const gamePlayerSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: {
      type: String,
      enum: ["mayor", "seer", "werewolf", "villager", null],
      default: null,
    },
    isConnected: {
      type: Boolean,
      default: true,
    },
  },
  { _id: false }
);

const tokenUsageSchema = new Schema(
  {
    questionIndex: {
      type: Number,
      required: true,
    },
    token: {
      type: String,
      enum: ["yes", "no", "maybe", "soClose"],
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const questionSchema = new Schema(
  {
    playerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    response: {
      type: String,
      enum: ["yes", "no", "maybe", "soClose", null],
      default: null,
    },
    isGuess: {
      type: Boolean,
      default: false,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const voteSchema = new Schema(
  {
    voterId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    targetId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const gameSettingsSchema = new Schema(
  {
    dayDuration: {
      type: Number,
      default: 240, // 4 minutes
    },
    tokenCounts: {
      yes: { type: Number, default: 10 },
      no: { type: Number, default: 10 },
      maybe: { type: Number, default: 3 },
      soClose: { type: Number, default: 1 },
    },
    wordCategory: {
      type: String,
      default: "general",
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "medium",
    },
  },
  { _id: false }
);

const gameSchema = new Schema<IGame>(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      minlength: 4,
      maxlength: 4,
    },
    host: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    players: {
      type: [gamePlayerSchema],
      default: [],
    },
    status: {
      type: String,
      enum: ["lobby", "night", "day", "voting", "ended"],
      default: "lobby",
    },
    magicWord: {
      type: String,
      default: null,
    },
    wordOptions: {
      type: [String],
      default: [],
    },
    tokens: {
      yes: { type: Number, default: 10 },
      no: { type: Number, default: 10 },
      maybe: { type: Number, default: 3 },
      soClose: { type: Number, default: 1 },
    },
    tokensUsed: {
      type: [tokenUsageSchema],
      default: [],
    },
    questions: {
      type: [questionSchema],
      default: [],
    },
    wordGuessed: {
      type: Boolean,
      default: false,
    },
    guessedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    votes: {
      type: [voteSchema],
      default: [],
    },
    voteType: {
      type: String,
      enum: ["findSeer", "findWerewolf", null],
      default: null,
    },
    winner: {
      type: String,
      enum: ["village", "werewolf", null],
      default: null,
    },
    settings: {
      type: gameSettingsSchema,
      default: () => ({}),
    },
    dayStartTime: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Index for quick code lookups
gameSchema.index({ code: 1 });
// Index for finding active games
gameSchema.index({ status: 1 });

const Game = mongoose.model<IGame>("Game", gameSchema);

export default Game;
