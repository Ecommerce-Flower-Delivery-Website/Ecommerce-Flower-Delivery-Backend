import { adminAuthMiddleware } from "@/middleware/adminAuthMiddleware";
import express from "express";
import contactController from "./../controllers/contactController";

const router = express.Router();
router.post("/",  contactController.create);
router.get("/", contactController.getAll);
router.put("/:id",  contactController.toggleCheck);
router.delete("/:id",  contactController.delete);

export default router;
