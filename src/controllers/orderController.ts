import { validateSchemas } from "@/lib/zod";
import cartModel from "@/models/cartModel";
import orderModel from "@/models/orderModel";
import subscribeModel, { subscribeType } from "@/models/subscribeModel";
import { type UserType } from "@/models/userModel";
import { sendResponse } from "@/utils/helpers";
import { Request, Response } from "express";

type OrderCreateRequest = typeof validateSchemas.createOrderSchema._input;
const OrdersController = {
  async create(req: Request & { user?: UserType }, res: Response) {
    try {
      const data = req.body as Partial<OrderCreateRequest>;
      const user = req.user;
      if (!user) {
        return sendResponse(res, 404, "fail", "user not found");
      }
      if (!data.cart_id) {
        return sendResponse(res, 400, "error", "Cart failed");
      }
      const cartInfo = await cartModel.findById(data.cart_id);
      if (!cartInfo) {
        return sendResponse(res, 404, "fail", "Cart not found");
      }
      let discount: subscribeType | null = null;
      if (user.subscribe_id) {
        discount = await subscribeModel.findById(user.subscribe_id);
      }
      const validatedData = validateSchemas.createOrderSchema.parse(req.body);

      const newOrder = await orderModel.create({
        array_product: cartInfo.product_array,
        totalAmount: cartInfo.totalAmount,
        address: validatedData.address,
        cardNumber: validatedData.cardNumber,
        cvvCode: validatedData.cvvCode,
        dateDelivery: validatedData.dateDelivery,
        timeDelivery: validatedData.timeDelivery,
        doesKnowAddress: validatedData.doesKnowAddress,
        recipientName: user.name,
        discountGift: discount?.discount,
        recipientPhone: user.phone,
        discountSubscribe: discount?.discount,
      });
      sendResponse(res, 200, "success", newOrder);
    } catch (error: any) {
      sendResponse(res, 400, "fail", error.errors || "Validation failed");
    }
  },

  async getAll(req: Request, res: Response) {
    try {
      const orders = await orderModel.find();
      sendResponse(res, 200, "success", orders);
    } catch (error) {
      sendResponse(res, 500, "error", "Failed to fetch orders");
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const order = await orderModel.findById(req.params.id);
      if (!order) return sendResponse(res, 404, "fail", "Order not found");
      sendResponse(res, 200, "success", order);
    } catch (error) {
      sendResponse(res, 500, "error", "Failed to fetch order");
    }
  },

  async update(req: Request, res: Response) {
    try {
      const validatedData = validateSchemas.updateOrderSchema.parse(req.body);
      const updatedOrder = await orderModel.findByIdAndUpdate(
        req.params.id,
        validatedData,
        { new: true }
      );
      if (!updatedOrder)
        return sendResponse(res, 404, "fail", "Order not found");
      sendResponse(res, 200, "success", updatedOrder);
    } catch (error: any) {
      sendResponse(res, 400, "fail", error.errors || "Validation failed");
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const deletedOrder = await orderModel.findByIdAndDelete(req.params.id);
      if (!deletedOrder)
        return sendResponse(res, 404, "fail", "Order not found");
      sendResponse(res, 200, "success", deletedOrder);
    } catch (error) {
      sendResponse(res, 500, "error", "Failed to delete order");
    }
  },
};

export default OrdersController;
