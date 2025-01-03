import OrdersController from "@/controllers/orderController";
import { authMiddleware } from "@/middleware/authMiddleware";
import express from "express";

const router = express.Router();

router.post("/", authMiddleware, OrdersController.create);
router.get("/", OrdersController.getAll);
router.get("/:id", OrdersController.getById);
router.put("/:id", OrdersController.toggleStatus);
router.delete("/:id", OrdersController.delete);

export default router;
