import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../lib/jwt";
import { User } from "../models/userModel";

export const adminAuthMiddleware = async (
  req: Request & {
    user?: unknown;
  },
  res: Response,
  next: NextFunction
) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    res.status(401).json({ msg: "No token, authorization denied" });
  }
  if (token) {
    try {
      const decoded = verifyToken(token) as { id: string };
      const user = await User.findById(decoded.id);
      if (!user) {
        res.status(404).json({ msg: "User not found" });
      }
      if (!user?.isAdmin) {
        res.status(401).json({ msg: "you are not authorized" });
      }
      req.user = user;
      next();
    } catch {
      res.status(401).json({ msg: "Invalid token" });
    }
  }
};
