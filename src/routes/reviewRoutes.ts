import express from "express";
import * as reviwController from "./../controllers/reviewController";
import { adminAuthMiddleware } from "../middleware/adminAuthMiddleware";
import { authMiddleware } from "../middleware/authMiddleware";

const reviewRouter = express.Router();

reviewRouter
  .post("/", reviwController.createReview)
  .get("/", reviwController.getReviews);

reviewRouter
  .route("/:id")
  .delete(reviwController.deleteReview)
  .put(reviwController.editReview);

export default reviewRouter;
