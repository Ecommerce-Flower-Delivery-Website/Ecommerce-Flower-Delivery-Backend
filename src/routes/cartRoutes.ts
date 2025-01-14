import express from "express";
import cartController from "./../controllers/cartController";
import { authMiddleware } from "@/middleware/authMiddleware";

 const router = express.Router();
 router.get("/", authMiddleware, cartController.getCart);
 router.post("/", authMiddleware, cartController.addElementToCart);
 router.delete("/:productId", authMiddleware, cartController.removeElementFromCart);

export default router;
