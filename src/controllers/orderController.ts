import cartModel from "@/models/cartModel";
import orderModel from "@/models/orderModel";
import { subscribeType } from "@/models/subscribeModel";
import { UserType } from "@/models/userModel";
import { sendResponse } from "@/utils/sendResponse";
import { createOrderSchema } from "@/validation/orderValidation";
import { NextFunction, Request, Response } from "express";
import { ValidationError, fromError } from "zod-validation-error";

const OrdersController = {
  async create(
    req: Request & { user?: UserType },
    res: Response,
    next: NextFunction
  ) {
    try {
      const user = req.user;
      if (!user) {
        return sendResponse(res, 404, {
          status: "fail",
          message: "User not found",
        });
      }
      const cartInfo = await cartModel.findOne({ userId: user.id });
      if (!cartInfo) {
        return sendResponse(res, 404, {
          status: "fail",
          message: "Cart not found",
        });
      }

      const subscribe = (await user.populate("subscribe_id"))
        .subscribe_id as subscribeType;

      const validatedData = createOrderSchema.parse(req.body);

      const newOrder = await orderModel.create({
        cart_id: cartInfo.id,
        array_product: validatedData.items,
        totalAmount: cartInfo.priceAll,
        address: validatedData.dontKnowAddress
          ? undefined
          : {
              street: validatedData.street,
              apartmentNumber: validatedData.apartmentNumber,
            },
        cardNumber: validatedData.cardNumber,
        expiryDate: validatedData.expiryDate,
        cvv: validatedData.cvv,
        deliveryDate: validatedData.deliveryDate,
        deliveryTime: validatedData.deliveryTime,
        dontKnowAddress: validatedData.dontKnowAddress,
        recipientName: validatedData.recipientName,
        discountGift: validatedData.discountGift,
        recipientPhone: validatedData.recipientPhone,
        discountSubscribe: subscribe.discount,
      });
      sendResponse(res, 200, { status: "success", data: newOrder });
    } catch (error) {
      if (error instanceof ValidationError) {
        // Format the error using zod-validation-error
        const formattedError = fromError(error).message;
        return sendResponse(res, 400, {
          status: "fail",
          message: formattedError,
        });
      } else {
        next(error);
      }
    }
  },

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;

      const orders = await orderModel.find().skip(skip).limit(limit);

      const totalOrders = await orderModel.countDocuments();
      const totalPages = Math.ceil(totalOrders / limit);

      sendResponse(res, 200, {
        status: "success",
        data: {
          orders,
          pagination: {
            totalOrders,
            totalPages,
            currentPage: page,
            pageSize: limit,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  },
  //TODO : remove if not used
  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const order = await orderModel.findById(req.params.id);
      if (!order)
        return sendResponse(res, 404, {
          status: "fail",
          message: "Order not found",
        });
      sendResponse(res, 200, { status: "success", data: order });
    } catch (error) {
      next(error);
    }
  },

  async toggleStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const orderId = req.params.id;
      if (!orderId)
        return sendResponse(res, 400, {
          status: "fail",
          message: "Invalid order ID",
        });
      const order = await orderModel.findById(orderId);
      if (!order)
        return sendResponse(res, 404, {
          status: "fail",
          message: "Order not found",
        });
      order.isDone = !order.isDone;
      await order?.save();
      sendResponse(res, 200, { status: "success", data: order });
    } catch (error) {
      if (error instanceof ValidationError) {
        const formattedError = fromError(error).message;
        return sendResponse(res, 400, {
          status: "fail",
          message: formattedError,
        });
      } else {
        next(error);
      }
    }
  },

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const deletedOrder = await orderModel.findByIdAndDelete(req.params.id);
      if (!deletedOrder)
        return sendResponse(res, 404, {
          status: "fail",
          message: "Order not found",
        });
      sendResponse(res, 200, { status: "success", data: "" });
    } catch (error) {
      next(error);
    }
  },
};

export default OrdersController;
