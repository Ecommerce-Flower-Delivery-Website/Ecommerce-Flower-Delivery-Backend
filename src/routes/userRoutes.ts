import express from "express";
import userController from "./../controllers/userController";
import { adminAuthMiddleware } from "@/middleware/adminAuthMiddleware";
import { authMiddleware } from "@/middleware/authMiddleware";

const router = express.Router();

router.get("/", adminAuthMiddleware, userController.getUsers);

router.get("/:id", adminAuthMiddleware, userController.getUser);

router.patch("/:id", adminAuthMiddleware, userController.updateUser);

router.delete("/:id", adminAuthMiddleware, userController.deleteUser);

export default router;
