import express from "express";
import * as subscribeController from "./../controllers/subscribeController";
import { adminAuthMiddleware } from "../middleware/adminAuthMiddleware";
import upload from '../middleware/upload.middleware';
import { authMiddleware } from "@/middleware/authMiddleware";
import filterMiddleware from "@/middleware/filterMiddleware";

const subscribePlansRouter = express.Router();

subscribePlansRouter.post("/",adminAuthMiddleware,upload.single('image'), subscribeController.createSubscribePlan )
                    .get("/",  filterMiddleware,subscribeController.getSubscribePlans)
                    
subscribePlansRouter.route("/:id",)
    .delete(adminAuthMiddleware,subscribeController.deleteSubscribePlan)
    .put(adminAuthMiddleware,upload.single('image'),subscribeController.editSubscribePlan)
    .get(subscribeController.getSubscribePlan)
    .post(authMiddleware,subscribeController.addUserToPlan )
    .delete(authMiddleware,subscribeController.deleteUserfromPlan )

subscribePlansRouter.route("/users/:id",)
    .post(authMiddleware,subscribeController.addUserToPlan )
    .delete(authMiddleware,subscribeController.deleteUserfromPlan )
    
export default subscribePlansRouter;
