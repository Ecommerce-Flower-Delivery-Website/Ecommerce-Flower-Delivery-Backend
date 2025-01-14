import express from "express";
import * as subscribeController from "./../controllers/subscribeController";
import { adminAuthMiddleware } from "../middleware/adminAuthMiddleware";
import upload from '../middleware/upload.middleware';
import { authMiddleware } from "@/middleware/authMiddleware";

const subscribePlansRouter = express.Router();

subscribePlansRouter.post("/",upload.single('image'), subscribeController.createSubscribePlan )
                    .get("/",subscribeController.getSubscribePlans)
                    
subscribePlansRouter.route("/:id")
    .delete(subscribeController.deleteSubscribePlan)
    .put(upload.single('image'),subscribeController.editSubscribePlan)
    .get(subscribeController.getSubscribePlan)
    .post(subscribeController.addUserToPlan )

    
export default subscribePlansRouter;
