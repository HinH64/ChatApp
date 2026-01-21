import { Response } from "express";
import User from "../models/user.models.js";
import type { AuthenticatedRequest } from "../types/index.js";

export const getUsersForSidebar = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const loggedInUserId = req.user!._id;

    const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select(
      "-password"
    );

    res.status(200).json(filteredUsers);
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error in getUsersForSidebar: ", error.message);
    }
    res.status(500).json({ error: "Internal server error" });
  }
};
