import { Response, NextFunction } from "express";
import type { AuthenticatedRequest } from "../types/index.js";

const adminOnly = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    res.status(401).json({ error: "Unauthorized - Not authenticated" });
    return;
  }

  if (req.user.role !== "admin") {
    res.status(403).json({ error: "Forbidden - Admin access required" });
    return;
  }

  next();
};

export default adminOnly;
