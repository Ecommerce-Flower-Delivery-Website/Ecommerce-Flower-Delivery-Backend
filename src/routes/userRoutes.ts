import express from "express";
import userController from "./../controllers/userController";
import { adminAuthMiddleware } from "@/middleware/adminAuthMiddleware";
import { authMiddleware } from "@/middleware/authMiddleware";
import filterMiddleware from "@/middleware/filterMiddleware";

const router = express.Router();

router.get("/", filterMiddleware, userController.getUsers);

router.get("/:id", userController.getUser);

router.patch("/:id",adminAuthMiddleware, userController.updateUser);

router.delete("/:id",adminAuthMiddleware, userController.deleteUser);

export default router;
