import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../lib/jwt";
import { User } from "../models/userModel";
import { sendResponse } from "@/utils/sendResponse";

export const authMiddleware = async (
  req: Request & {
    user?: unknown;
  },
  res: Response,
  next: NextFunction
) => {
  try{
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return sendResponse(res, 401, {
      status: "fail",
      message: `No token, authorization denied`,
    });
  }

  if (token) {
      const decoded = verifyToken(token) as { id: string };

      console.log("token is: ", token);
      console.log("decoded token is: ", decoded);
      
      const user = await User.findById(decoded.id);

      if (!user) {
        return sendResponse(res, 404, {
          status: "fail",
          message: `User not found`,
        });
      }

      if (!user?.isAdmin && !user?.isAccountVerified) {
        return sendResponse(res, 203, {
          status: "fail",
          message: `Your email need to be verified`,
        });
      }

      req.user = user;
      next();
  }
} catch(err) {
  console.log(err);
  
  sendResponse(res, 401, {
    status: "fail",
    message: `Invalid token`,
  });
}

};
