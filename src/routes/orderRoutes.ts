import OrdersController from "@/controllers/orderController";
import express from "express";

const router = express.Router();

router.post("/", OrdersController.create);
router.get("/", OrdersController.getAll);
router.get("/:id", OrdersController.getById);
router.put("/:id", OrdersController.update);
router.delete("/:id", OrdersController.delete);

export default router;
