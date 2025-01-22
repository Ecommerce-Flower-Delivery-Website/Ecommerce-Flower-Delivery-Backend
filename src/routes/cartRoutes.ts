import express from "express";
import cartController from "./../controllers/cartController";
import { authMiddleware } from "@/middleware/authMiddleware";

const router = express.Router();
router.get("/", authMiddleware, cartController.getCart);
router.post("/", authMiddleware, cartController.addElementToCart);
router.delete(
  "/:productId",
  authMiddleware,
  cartController.removeElementFromCart
);
router.delete(
  "/:productId/:accessoryId",
  authMiddleware,
  cartController.removeAccessoryFromCart
);
router.put("/:productId", authMiddleware, cartController.editCartItem);

export default router;
