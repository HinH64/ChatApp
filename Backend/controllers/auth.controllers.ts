import { Request, Response } from "express";
import User from "../models/user.models.js";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../utils/generateToken.js";
import type { SignupBody, LoginBody, ChangePasswordBody, AuthenticatedRequest } from "../types/index.js";

export const signup = async (
  req: Request<object, object, SignupBody>,
  res: Response
): Promise<void> => {
  try {
    const { fullName, username, password, confirmPassword, gender } = req.body;

    if (password !== confirmPassword) {
      res.status(400).json({ error: "Passwords don't match" });
      return;
    }

    const user = await User.findOne({ username });

    if (user) {
      res.status(400).json({ error: "Username already exist" });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      username,
      password: hashedPassword,
      ...(gender && { gender }),
      profilePic: "", // Frontend Avatar component handles fallback with initials
    });

    if (newUser) {
      // Generate JWT token here
      generateTokenAndSetCookie(newUser._id, res);
      await newUser.save();

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        username: newUser.username,
        profilePic: newUser.profilePic,
        role: newUser.role,
      });
    } else {
      res.status(400).json({ error: "Invalid user data" });
    }
  } catch (error) {
    if (error instanceof Error) {
      console.log("Error in signup controller", error.message);
    }
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const login = async (
  req: Request<object, object, LoginBody>,
  res: Response
): Promise<void> => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");

    if (!user || !isPasswordCorrect) {
      res.status(400).json({ error: "Invalid username or password" });
      return;
    }

    generateTokenAndSetCookie(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      username: user.username,
      profilePic: user.profilePic,
      role: user.role,
    });
  } catch (error) {
    if (error instanceof Error) {
      console.log("Error in login controller", error.message);
    }
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const logout = (_req: Request, res: Response): void => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    if (error instanceof Error) {
      console.log("Error in logout controller", error.message);
    }
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const changePassword = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { currentPassword, newPassword, confirmNewPassword } =
      req.body as ChangePasswordBody;
    const userId = req.user!._id;

    // Validate input
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      res.status(400).json({ error: "All fields are required" });
      return;
    }

    if (newPassword !== confirmNewPassword) {
      res.status(400).json({ error: "New passwords don't match" });
      return;
    }

    if (newPassword.length < 6) {
      res.status(400).json({ error: "New password must be at least 6 characters" });
      return;
    }

    // Get user with password
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    // Verify current password
    const isPasswordCorrect = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordCorrect) {
      res.status(400).json({ error: "Current password is incorrect" });
      return;
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    await User.findByIdAndUpdate(userId, { password: hashedPassword });

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    if (error instanceof Error) {
      console.log("Error in changePassword controller", error.message);
    }
    res.status(500).json({ error: "Internal Server Error" });
  }
};
