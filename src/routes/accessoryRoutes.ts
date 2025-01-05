import express from "express";
import {
  createAccessoryController,
  deleteAccessoryController,
  getAccessoryByIdController,
  getAllAccessoriesController,
  updateAccessoryController,
} from "../controllers/accessoryController";
import { adminAuthMiddleware } from "@/middleware/adminAuthMiddleware";

const router = express.Router();

//* /api/v1/accessory
router
  .route("/")
  .get(getAllAccessoriesController)
  .post(adminAuthMiddleware, createAccessoryController);

//* /api/v1/accessory/:id
router
  .route("/:id")
  .get(getAccessoryByIdController)
  .put(adminAuthMiddleware, updateAccessoryController)
  .delete(adminAuthMiddleware, deleteAccessoryController);

export default router;
