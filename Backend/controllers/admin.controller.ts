import { Response } from "express";
import User from "../models/user.models.js";
import type { AuthenticatedRequest, UserRole } from "../types/index.js";

export const getAllUsers = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    if (error instanceof Error) {
      console.log("Error in getAllUsers controller: ", error.message);
    }
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getUserById = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select("-password");

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    if (error instanceof Error) {
      console.log("Error in getUserById controller: ", error.message);
    }
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateUserRole = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { role } = req.body as { role: UserRole };

    if (!role || !["user", "admin"].includes(role)) {
      res.status(400).json({ error: "Invalid role. Must be 'user' or 'admin'" });
      return;
    }

    // Prevent admin from changing their own role
    if (req.user?._id.toString() === id) {
      res.status(400).json({ error: "Cannot change your own role" });
      return;
    }

    const user = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true }
    ).select("-password");

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    if (error instanceof Error) {
      console.log("Error in updateUserRole controller: ", error.message);
    }
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteUser = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    // Prevent admin from deleting themselves
    if (req.user?._id.toString() === id) {
      res.status(400).json({ error: "Cannot delete your own account" });
      return;
    }

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    if (error instanceof Error) {
      console.log("Error in deleteUser controller: ", error.message);
    }
    res.status(500).json({ error: "Internal server error" });
  }
};
