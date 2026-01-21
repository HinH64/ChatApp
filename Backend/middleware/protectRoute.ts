import jwt from "jsonwebtoken";
import { Response, NextFunction } from "express";
import User from "../models/user.models.js";
import type { AuthenticatedRequest, JwtPayload } from "../types/index.js";

const protectRoute = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      res.status(401).json({ error: "Unauthorized - No Token Provided" });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

    if (!decoded) {
      res.status(401).json({ error: "Unauthorized - Invalid Token" });
      return;
    }

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    req.user = user;

    next();
  } catch (error) {
    if (error instanceof Error) {
      console.log("Error in protectRoute middleware: ", error.message);
    }
    res.status(500).json({ error: "Internal server error" });
  }
};

export default protectRoute;
