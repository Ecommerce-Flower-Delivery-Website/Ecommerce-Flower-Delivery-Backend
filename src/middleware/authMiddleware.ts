import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../lib/jwt";
import { User } from "../models/userModel";
import { sendResponse } from "@/utils/helpers";

export const authMiddleware = async (
  req: Request & {
    user?: unknown;
  },
  res: Response,
  next: NextFunction
) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return sendResponse(res, 401, {
      status: "fail",
      message: `No token, authorization denied`,
    });
  }
  if (token) {
    try {
      const decoded = verifyToken(token) as { id: string };
      const user = await User.findById(decoded.id);
      if (!user) {
        return sendResponse(res, 404, {
          status: "fail",
          message: `User not found`,
        });
      }
      req.user = user;
      next();
    } catch {
      sendResponse(res, 401, {
        status: "fail",
        message: `Invalid token`,
      });
    }
  }
};
