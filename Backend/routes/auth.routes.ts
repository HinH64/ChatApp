import express from "express";
import { login, logout, signup, changePassword } from "../controllers/auth.controllers.js";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.put("/password", protectRoute, changePassword);

export default router;
