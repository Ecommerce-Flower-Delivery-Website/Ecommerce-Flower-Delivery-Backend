import { adminAuthMiddleware } from "@/middleware/adminAuthMiddleware";
import express from "express";
import contactController from "./../controllers/contactController";
import filterMiddleware from "@/middleware/filterMiddleware";

const router = express.Router();
router.post("/",adminAuthMiddleware,  contactController.create);
router.get("/",filterMiddleware, contactController.getAll);
router.put("/:id", adminAuthMiddleware, contactController.toggleCheck);
router.delete("/:id",adminAuthMiddleware,  contactController.delete);

export default router;
