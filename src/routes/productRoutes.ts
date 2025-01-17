import express from "express";
import upload from "../middleware/productsPhotoUpload";
import productController from "./../controllers/productController";
const router = express.Router();

router
  .route("/")
  .get(productController.getProducts)
  .post(upload.single("image"), productController.addProduct);

router
  .route("/:id")
  .get(productController.getProduct)
  .delete(productController.deleteProducts)
  .put(upload.single("image"), productController.editProduct);

export default router;
