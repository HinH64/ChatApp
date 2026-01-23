import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import adminOnly from "../middleware/adminOnly.js";
import {
  getAllUsers,
  getUserById,
  updateUserRole,
  deleteUser,
} from "../controllers/admin.controller.js";

const router = express.Router();

// All admin routes require authentication and admin role
router.use(protectRoute, adminOnly);

router.get("/users", getAllUsers);
router.get("/users/:id", getUserById);
router.patch("/users/:id/role", updateUserRole);
router.delete("/users/:id", deleteUser);

export default router;
