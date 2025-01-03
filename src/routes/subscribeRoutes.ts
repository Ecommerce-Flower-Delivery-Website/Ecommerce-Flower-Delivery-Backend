import express from "express";
import * as subscribeController from "./../controllers/subscribeController";
import { adminAuthMiddleware } from "../middleware/adminAuthMiddleware";
import upload from '../middleware/upload.middleware';

const subscribePlansRouter = express.Router();

subscribePlansRouter.post("/",adminAuthMiddleware,upload.single('image'), subscribeController.createSubscribePlan )
                    .get("/",subscribeController.getSubscribePlans)

subscribePlansRouter.route("/:id")
    .delete(adminAuthMiddleware,subscribeController.deleteSubscribePlan)
    .put(adminAuthMiddleware,upload.single('image'),subscribeController.editSubscribePlan);

export default subscribePlansRouter;
