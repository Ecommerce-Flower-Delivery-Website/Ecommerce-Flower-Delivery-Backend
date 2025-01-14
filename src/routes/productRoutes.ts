import express from "express";
import productController from "./../controllers/productController";
import { authMiddleware } from "./../middleware/authMiddleware";
import upload from "../middleware/productsPhotoUpload";
import { adminAuthMiddleware } from "@/middleware/adminAuthMiddleware";
const router = express.Router();

router
  .route("/")
  .get( productController.getProducts)
  .post(
    upload.single("image"),
    productController.addProduct
  );

router
  .route("/:id")
  .get(productController.getProduct)
  .delete( productController.deleteProducts)
  .put(
    
    upload.single("image"),
    productController.editProduct
  );

export default router;
