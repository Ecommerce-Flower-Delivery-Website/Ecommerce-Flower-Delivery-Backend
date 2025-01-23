import express from "express";
import {
  createAccessoryController,
  deleteAccessoryController,
  getAccessoryByIdController,
  getAllAccessoriesController,
  updateAccessoryController,
} from "../controllers/accessoryController";
import { adminAuthMiddleware } from "@/middleware/adminAuthMiddleware";
import upload from "@/middleware/accessoryPhotoUpload";
import filterMiddleware from "@/middleware/filterMiddleware";

const router = express.Router();

//* /api/v1/accessory
router
  .route("/")
  .get( filterMiddleware, getAllAccessoriesController)
  .post(adminAuthMiddleware, upload.single("image"), createAccessoryController);

//* /api/v1/accessory/:id
router
  .route("/:id")
  .get(getAccessoryByIdController)
  .put(adminAuthMiddleware, updateAccessoryController)
  .delete(adminAuthMiddleware,  deleteAccessoryController);

export default router;
