import express from "express";
import upload from "../middleware/productsPhotoUpload";
import productController from "./../controllers/productController";
import { adminAuthMiddleware } from "@/middleware/adminAuthMiddleware";
import { authMiddleware } from "./../middleware/authMiddleware";
const router = express.Router();

router
  .route("/")
  .get(
    // authMiddleware,
    productController.getProducts
  )
  .post(
    // adminAuthMiddleware,
    upload.single("image"),
    productController.addProduct
  );

router
  .route("/:id")
  .get(
    // authMiddleware,
    productController.getProduct
  )
  .delete(
    // adminAuthMiddleware,
    productController.deleteProducts
  )
  .put(
    // adminAuthMiddleware,
    upload.single("image"),
    productController.editProduct
  );

router.route("/:id/relate").get(productController.getRelatedProducts);

export default router;
