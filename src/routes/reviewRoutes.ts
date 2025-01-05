import express from "express";
import * as reviwController from "./../controllers/reviewController";
import { adminAuthMiddleware } from "../middleware/adminAuthMiddleware";
import { authMiddleware } from "../middleware/authMiddleware";

const reviewRouter = express.Router();


reviewRouter.post("/",authMiddleware, reviwController.createReview )
                    .get("/",reviwController.getReviews)

reviewRouter.route("/:id")
    .delete(adminAuthMiddleware,reviwController.deleteReview)
    .put(adminAuthMiddleware,reviwController.editReview);

export default reviewRouter;
