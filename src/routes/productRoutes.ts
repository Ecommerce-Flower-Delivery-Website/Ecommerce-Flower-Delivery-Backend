import express from "express";
import productController from "./../controllers/productController";
import { authMiddleware } from "./../middleware/authMiddleware";
import upload from "../middleware/productsPhotoUpload";
import { adminAuthMiddleware } from "@/middleware/adminAuthMiddleware";
const router = express.Router();

router
  .route("/")
  .get(authMiddleware, productController.getProducts)
  .post(
    adminAuthMiddleware,
    upload.single("image"),
    productController.addProduct
  );

router
  .route("/:id")
  .get(authMiddleware, productController.getProduct)
  .delete(adminAuthMiddleware, productController.deleteProducts)
  .put(
    adminAuthMiddleware,
    upload.single("image"),
    productController.editProduct
  );

export default router;
