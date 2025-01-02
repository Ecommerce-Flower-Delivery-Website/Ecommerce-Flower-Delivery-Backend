import express from "express";
import contactController from "./../controllers/contactController";
import { authMiddleware } from "@/middleware/authMiddleware";
import { adminAuthMiddleware } from "@/middleware/adminAuthMiddleware";

const router = express.Router();
router.post("/", authMiddleware, contactController.create);
router.get("/", contactController.getAll);
router.put("/:id", adminAuthMiddleware, contactController.toggleCheck);
router.delete("/:id", adminAuthMiddleware, contactController.delete);

export default router;
