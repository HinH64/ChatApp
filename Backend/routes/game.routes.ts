import express from "express";
import {
  createGame,
  joinGame,
  getGame,
  getMyGames,
  leaveGame,
  getWordCategories,
  updateGameSettings,
} from "../controllers/game.controller.js";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

// Create a new game
router.post("/create", protectRoute, createGame);

// Join a game by code
router.post("/join", protectRoute, joinGame);

// Get user's active games (must come before /:code)
router.get("/", protectRoute, getMyGames);

// Get word categories (must come before /:code)
router.get("/categories", protectRoute, getWordCategories);

// Get game by code
router.get("/:code", protectRoute, getGame);

// Leave a game
router.delete("/:code/leave", protectRoute, leaveGame);

// Update game settings (host only)
router.patch("/:code/settings", protectRoute, updateGameSettings);

export default router;
