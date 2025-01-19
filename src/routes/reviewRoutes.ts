import express from "express";
import * as reviwController from "./../controllers/reviewController";
import { adminAuthMiddleware } from "../middleware/adminAuthMiddleware";
import { authMiddleware } from "../middleware/authMiddleware";
import filterMiddleware from "@/middleware/filterMiddleware";

const reviewRouter = express.Router();

reviewRouter
  .post("/", reviwController.createReview)
  .get("/", filterMiddleware, reviwController.getReviews);

reviewRouter
  .route("/:id")
  .delete(reviwController.deleteReview)
  .put(reviwController.editReview);

export default reviewRouter;
