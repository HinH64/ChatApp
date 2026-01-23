import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import { avatarUpload } from "../middleware/upload.js";
import {
  getUsersForSidebar,
  getMyProfile,
  getUserProfile,
  updateProfile,
  uploadAvatar,
  resetAvatar,
} from "../controllers/user.controller.js";

const router = express.Router();

// Get all users for sidebar (existing)
router.get("/", protectRoute, getUsersForSidebar);

// Profile routes
router.get("/profile", protectRoute, getMyProfile);
router.put("/profile", protectRoute, updateProfile);
router.post("/profile/avatar", protectRoute, avatarUpload, uploadAvatar);
router.delete("/profile/avatar", protectRoute, resetAvatar);

// Get specific user's profile (must be after /profile routes)
router.get("/:id", protectRoute, getUserProfile);

export default router;
