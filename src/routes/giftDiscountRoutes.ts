import express from "express";
import giftDiscountController from "./../controllers/giftDiscountController";
import filterMiddleware from "@/middleware/filterMiddleware";
import { adminAuthMiddleware } from "@/middleware/adminAuthMiddleware";

const router = express.Router();

router.post("/",adminAuthMiddleware, giftDiscountController.addGiftDiscount);

router.put("/:id",adminAuthMiddleware, giftDiscountController.updateGiftDiscountById);

router.delete("/:id",adminAuthMiddleware, giftDiscountController.removeGiftDiscountById);

router.get("/", filterMiddleware, giftDiscountController.getAllGiftDiscounts);

router.get("/code/:code", giftDiscountController.getByCodeGift);

export default router;
