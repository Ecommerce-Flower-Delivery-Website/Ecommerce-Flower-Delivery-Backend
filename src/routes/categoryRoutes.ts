import express from "express";
import categoryController from "./../controllers/categoryController";
import categoryUpload from "@/middleware/categoryUpload";
import filterMiddleware from "@/middleware/filterMiddleware";
import { adminAuthMiddleware } from "@/middleware/adminAuthMiddleware";

const router = express.Router();

router
  .route("/")
  .get(filterMiddleware, categoryController.getCategories)
  .post(adminAuthMiddleware, categoryUpload.single("image"), categoryController.addCategory);

router
  .route("/:id")
  .get(categoryController.getCategory)
  .put(adminAuthMiddleware, categoryUpload.single("image"), categoryController.editCategory)
  .delete(adminAuthMiddleware, categoryController.deleteCategory);

export default router;
