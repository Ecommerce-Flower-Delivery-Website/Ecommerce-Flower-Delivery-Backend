import express from "express";
import {
  createAccessoryController,
  deleteAccessoryController,
  getAccessoryByIdController,
  getAllAccessoriesController,
  updateAccessoryController,
} from "../controllers/accessoryController";

const router = express.Router();

//* /api/v1/accessory
router
  .route("/")
  .get(getAllAccessoriesController)
  .post(createAccessoryController);

//* /api/v1/accessory/:id
router
  .route("/:id")
  .get(getAccessoryByIdController)
  .put(updateAccessoryController)
  .delete(deleteAccessoryController);

export default router;
