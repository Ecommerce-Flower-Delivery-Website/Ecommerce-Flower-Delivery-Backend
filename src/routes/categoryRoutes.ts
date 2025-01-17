import express from "express";
import categoryController from "./../controllers/categoryController";
import categoryUpload from "@/middleware/categoryUpload";
import { adminAuthMiddleware } from "@/middleware/adminAuthMiddleware";
import CategoryController from "./../controllers/categoryController";

const router = express.Router();

router
  .route("/")
  .get(categoryController.getCategories)
  .post(categoryUpload.single("image"), categoryController.addCategory);

router
  .route("/:id")
  .get(categoryController.getCategory)
  .put(categoryUpload.single("image"), categoryController.editCategory)
  .delete(categoryController.deleteCategory);

router.route("/withoutPagination")
      .get(CategoryController.getAllCategory);

export default router;
