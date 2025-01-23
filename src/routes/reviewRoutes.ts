import express from "express";
import * as reviwController from "./../controllers/reviewController";
import { adminAuthMiddleware } from "../middleware/adminAuthMiddleware";
import { authMiddleware } from "../middleware/authMiddleware";
import filterMiddleware from "@/middleware/filterMiddleware";

const reviewRouter = express.Router();

reviewRouter
  .post("/",adminAuthMiddleware, reviwController.createReview)
  .get("/", filterMiddleware, reviwController.getReviews);

reviewRouter
  .route("/:id")
  .delete(adminAuthMiddleware, reviwController.deleteReview)
  .put(adminAuthMiddleware, reviwController.editReview);

export default reviewRouter;
