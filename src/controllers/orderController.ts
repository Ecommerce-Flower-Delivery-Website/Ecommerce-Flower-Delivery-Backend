import cartModel from "@/models/cartModel";
import orderModel from "@/models/orderModel";
import subscribeModel, { subscribeType } from "@/models/subscribeModel";
import { UserType } from "@/models/userModel";
import { sendResponse } from "@/utils/helpers";
import { createOrderSchema } from "@/validation/orderValidation";
import { Request, Response } from "express";
import { ValidationError } from "zod-validation-error";

type OrderCreateRequest = typeof createOrderSchema._input;

const OrdersController = {
  async create(req: Request & { user?: UserType }, res: Response) {
    try {
      const data = req.body as Partial<OrderCreateRequest>;
      const user = req.user;
      if (!user) {
        return sendResponse(res, 404, {
          status: "fail",
          message: "User not found",
        });
      }
      if (!data.cart_id) {
        return sendResponse(res, 400, {
          status: "error",
          message: "Cart ID is required",
          error: "Missing cart_id",
        });
      }
      const cartInfo = await cartModel
        .findById(data.cart_id)
        .populate("product_array");
      if (!cartInfo) {
        return sendResponse(res, 404, {
          status: "fail",
          message: "Cart not found",
        });
      }
      if (cartInfo.product_array.length === 0) {
        return sendResponse(res, 400, {
          status: "fail",
          message: "Cart is empty",
        });
      }
      let discount: subscribeType | null = null;
      if (user.subscribe_id) {
        discount = await subscribeModel.findById(user.subscribe_id);
      }

      // Validate the request body using createOrderSchema
      const validatedData = createOrderSchema.parse(req.body);
      console.log("validatedData", validatedData);
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
        isDone: false,
        cart_id: validatedData.cart_id,
      });
      cartInfo.product_array = [];
      cartInfo.save();
      sendResponse(res, 200, { status: "success", data: newOrder });
    } catch (error) {
      if (error instanceof ValidationError) {
        // Format the error using zod-validation-error
        const formattedError = error.message;
        return sendResponse(res, 400, {
          status: "fail",
          message: formattedError,
        });
      } else {
        sendResponse(res, 400, {
          status: "fail",
          message: JSON.stringify(error),
        });
      }
    }
  },

  async getAll(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1; // Default to page 1
      const limit = parseInt(req.query.limit as string) || 10; // Default to 10 items per page
      const skip = (page - 1) * limit;

      const orders = await orderModel.find().skip(skip).limit(limit);

      const totalOrders = await orderModel.countDocuments();
      const totalPages = Math.ceil(totalOrders / limit);

      // Send paginated response
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
    } catch {
      sendResponse(res, 500, {
        status: "error",
        message: "Failed to fetch orders",
        error: "Database error",
      });
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const order = await orderModel.findById(req.params.id);
      if (!order)
        return sendResponse(res, 404, {
          status: "fail",
          message: "Order not found",
        });
      sendResponse(res, 200, { status: "success", data: order });
    } catch {
      sendResponse(res, 500, {
        status: "error",
        message: "Failed to fetch order",
        error: "Database error",
      });
    }
  },

  async toggleStatus(req: Request, res: Response) {
    try {
      const orderId = req.params.id;
      if (!orderId)
        return sendResponse(res, 400, {
          status: "error",
          message: "bad request",
          error: "Order Id is required",
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
        const formattedError = error.message;
        return sendResponse(res, 400, {
          status: "fail",
          message: formattedError,
        });
      } else {
        sendResponse(res, 400, {
          status: "fail",
          message: "Validation failed",
        });
      }
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const deletedOrder = await orderModel.findByIdAndDelete(req.params.id);
      if (!deletedOrder)
        return sendResponse(res, 404, {
          status: "fail",
          message: "Order not found",
        });
      sendResponse(res, 200, { status: "success", data: "" });
    } catch {
      sendResponse(res, 500, {
        status: "error",
        message: "Failed to delete order",
        error: "Database error",
      });
    }
  },
};

export default OrdersController;
