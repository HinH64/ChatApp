import { Response } from "express";
import fs from "fs";
import path from "path";
import User from "../models/user.models.js";
import type { AuthenticatedRequest, UpdateProfileBody } from "../types/index.js";

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

// Get current user's profile
export const getMyProfile = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const user = await User.findById(req.user!._id).select("-password");
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.status(200).json(user);
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error in getMyProfile: ", error.message);
    }
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get specific user's public profile
export const getUserProfile = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select("-password -email");
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.status(200).json(user);
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error in getUserProfile: ", error.message);
    }
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update current user's profile
export const updateProfile = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { fullName, email, bio, gender } = req.body as UpdateProfileBody;
    const userId = req.user!._id;

    // Build update object with only provided fields
    const updateData: Partial<UpdateProfileBody> = {};
    if (fullName !== undefined) updateData.fullName = fullName;
    if (email !== undefined) updateData.email = email || undefined; // allow clearing email
    if (bio !== undefined) updateData.bio = bio;
    if (gender !== undefined) updateData.gender = gender;

    // Check if email is already taken by another user
    if (email) {
      const existingUser = await User.findOne({ email, _id: { $ne: userId } });
      if (existingUser) {
        res.status(400).json({ error: "Email is already in use" });
        return;
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error in updateProfile: ", error.message);
    }
    res.status(500).json({ error: "Internal server error" });
  }
};

// Upload avatar
export const uploadAvatar = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ error: "No file uploaded" });
      return;
    }

    const userId = req.user!._id;
    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    // Delete old avatar if it's a local file
    if (user.profilePic && user.profilePic.includes("/uploads/avatars/")) {
      const oldFilename = user.profilePic.split("/uploads/avatars/")[1];
      const oldFilePath = path.join(process.cwd(), "uploads", "avatars", oldFilename);
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }
    }

    // Build new avatar URL
    const avatarUrl = `/uploads/avatars/${req.file.filename}`;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: avatarUrl },
      { new: true }
    ).select("-password");

    res.status(200).json(updatedUser);
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error in uploadAvatar: ", error.message);
    }
    res.status(500).json({ error: "Internal server error" });
  }
};

// Reset avatar to default
export const resetAvatar = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user!._id;
    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    // Delete old avatar if it's a local file
    if (user.profilePic && user.profilePic.includes("/uploads/avatars/")) {
      const oldFilename = user.profilePic.split("/uploads/avatars/")[1];
      const oldFilePath = path.join(process.cwd(), "uploads", "avatars", oldFilename);
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }
    }

    // Reset to empty - Frontend Avatar component handles fallback with initials
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: "" },
      { new: true }
    ).select("-password");

    res.status(200).json(updatedUser);
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error in resetAvatar: ", error.message);
    }
    res.status(500).json({ error: "Internal server error" });
  }
};
