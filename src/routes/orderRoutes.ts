// import OrdersController from "@/controllers/orderController";
import OrdersController from "@/controllers/orderController";
import { adminAuthMiddleware } from "@/middleware/adminAuthMiddleware";
import { authMiddleware } from "@/middleware/authMiddleware";
import express from "express";

const router = express.Router();

router.post("/", adminAuthMiddleware, OrdersController.create);
router.get("/", adminAuthMiddleware, OrdersController.getAll);
router.get("/:id", adminAuthMiddleware, OrdersController.getById);
router.put("/:id", adminAuthMiddleware, OrdersController.toggleStatus);
router.delete("/:id", adminAuthMiddleware, OrdersController.delete);

export default router;
