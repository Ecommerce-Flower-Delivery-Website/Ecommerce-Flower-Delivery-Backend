import { Product } from "@/models/Product";
import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../lib/jwt";
import { User } from "../models/User";

export const checkAuthorizedUserForProduct = async (
  req: Request & { user?: unknown; product?: unknown },
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    const product_id = req.params.product_id;
    const product = await Product.findById(product_id);
    if (product == null) {
      res.status(404).json({ message: "product not found" });
      return;
    }
    if (!token) {
      res.status(401).json({ msg: "No token, authorization denied" });
      return;
    }
    const decoded = verifyToken(token) as { id: string };
    const user = await User.findById(decoded.id);
    if (!user) {
      res.status(404).json({ msg: "User not found" });
      return;
    }
    if (product?.checkAuthUser(user?.id)) {
      req.user = user;
      req.product = product;
      next();
    } else {
      res
        .status(401)
        .json({ message: "you don't have permission to this action" });
      return;
    }
  } catch (error) {
    res.status(401).json({ msg: "Invalid token" });
  }
};
