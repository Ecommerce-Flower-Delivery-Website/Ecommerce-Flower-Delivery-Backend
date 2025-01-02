const express = require("express");
const productController = require("./../controllers/productController");
import { authMiddleware } from './../middleware/authMiddleware';
import upload from '../middleware/productsPhotoUpload';
const router = express.Router();

router.route("/")
      .get(authMiddleware,productController.getProducts)
      .post(authMiddleware,upload.single('image'),productController.addProduct);

router.route("/:id")
      .get(authMiddleware,productController.getProduct)
      .delete(authMiddleware,productController.deleteProducts)
      .put(authMiddleware,upload.single('image'),productController.editProduct);

export default router;
