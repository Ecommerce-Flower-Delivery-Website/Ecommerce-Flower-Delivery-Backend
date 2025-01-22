import express from "express";
import categoryController from "./../controllers/categoryController";
import categoryUpload from "@/middleware/categoryUpload";
import filterMiddleware from "@/middleware/filterMiddleware";

const router = express.Router();

router
  .route("/")
  .get(filterMiddleware, categoryController.getCategories)
  .post(categoryUpload.single("image"), categoryController.addCategory);

router
  .route("/:id")
  .get(categoryController.getCategory)
  .put(categoryUpload.single("image"), categoryController.editCategory)
  .delete(categoryController.deleteCategory);

export default router;
