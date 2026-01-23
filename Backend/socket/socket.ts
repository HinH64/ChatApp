import { Server as SocketIOServer } from "socket.io";
import http from "http";
import express from "express";
import User from "../models/user.models.js";

const app = express();

const server = http.createServer(app);
const io: SocketIOServer = new SocketIOServer(server, {
  cors: {
    origin: [process.env.VITE_SOCKET_IO_URL as string],
    methods: ["GET", "POST"],
  },
});

const userSocketMap: Record<string, string> = {};

export const getReceiverSocketId = (receiverId: string): string | undefined => {
  return userSocketMap[receiverId];
};

// Update lastSeen for a user
const updateLastSeen = async (userId: string) => {
  try {
    await User.findByIdAndUpdate(userId, { lastSeen: new Date() });
  } catch (error) {
    console.error("Error updating lastSeen:", error);
  }
};

io.on("connection", (socket) => {
  console.log("a user connected", socket.id);

  const userId = socket.handshake.query.userId as string;
  if (userId !== "undefined") {
    userSocketMap[userId] = socket.id;
  }

  // io.emit() is used to send events to all the connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // socket.on() is used to listen to the events. can be used both on client and server side
  socket.on("disconnect", async () => {
    console.log("user disconnected", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    // Update lastSeen when user disconnects
    if (userId && userId !== "undefined") {
      await updateLastSeen(userId);
    }
  });
});

export { app, io, server };
