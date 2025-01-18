import express from "express";
import giftDiscountController from "./../controllers/giftDiscountController";

const router = express.Router();

router.post("/", giftDiscountController.addGiftDiscount);

router.put("/:id", giftDiscountController.updateGiftDiscountById);

router.delete("/:id", giftDiscountController.removeGiftDiscountById);

router.get("/", giftDiscountController.getAllGiftDiscounts);

router.get("/code/:code", giftDiscountController.getByCodeGift);

export default router;
