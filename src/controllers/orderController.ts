import { TAccessory } from "@/models/accessoryModel";
import cartModel from "@/models/cartModel";
import giftDiscountModel from "@/models/giftDiscountModel";
import orderModel from "@/models/orderModel";
import { TProduct } from "@/models/productModel";
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

      const cartInfo = await cartModel
        .findOne({ userId: user.id })
        .populate({ path: "items.productId", model: "Product" })
        .populate({ path: "items.accessoriesId", model: "Accessory" });

      if (!cartInfo) {
        return sendResponse(res, 404, {
          status: "fail",
          message: "Cart not found",
        });
      }
      if (cartInfo.items.length <= 0) {
        return sendResponse(res, 400, {
          status: "fail",
          message: "Cart can't be empty",
        });
      }

      const validatedData = createOrderSchema.parse(req.body);

      const array_product = cartInfo.items.map((item) => {
        const product = item.productId as unknown as TProduct;
        if (!product || typeof product !== "object") {
          throw new Error("Product details not populated");
        }

        const accessories = (item.accessoriesId || []).map((acc) => {
          const accessory = acc as unknown as TAccessory;
          if (!accessory || typeof accessory !== "object") {
            throw new Error("Accessory details not populated");
          }
          return {
            title: accessory.title,
            image: accessory.image,
            currentPrice: accessory.price,
            quantity: 1,
          };
        });

        return {
          title: product.title,
          image: product.image,
          currentPrice: product.price,
          quantity: item.productQuantity,
          accessories,
        };
      });
      const totalPrice = array_product.reduce((total, product) => {
        const productTotal = Number(product.currentPrice) * product.quantity;
        const accessoriesTotal = product.accessories.reduce(
          (sum, accessory) =>
            sum + Number(accessory.currentPrice) * accessory.quantity,
          0
        );
        return total + productTotal + accessoriesTotal;
      }, 0);
      let giftCard;
      if (validatedData.discountGift) {
        giftCard = await giftDiscountModel.findOne({
          codeGift: validatedData.discountGift,
        });
      }
      const newOrder = await orderModel.create({
        cart_id: cartInfo.id,
        array_product,
        totalAmount: totalPrice,
        address: validatedData.dontKnowAddress
          ? undefined
          : {
              street: validatedData.street,
              apartmentNumber: validatedData.apartmentNumber,
            },
        cardNumber: validatedData.cardNumber,
        expiryDate: validatedData.expiryDate,
        deliveryDate: validatedData.deliveryDate,
        deliveryTime: validatedData.deliveryTime,
        dontKnowAddress: validatedData.dontKnowAddress,
        recipientName: validatedData.recipientName,
        discountGift: giftCard ? giftCard.discountGift : undefined,
        recipientPhone: validatedData.recipientPhone,
        cvvCode: validatedData.cvv,
        dateDelivery: validatedData.deliveryDate,
        apartmentNumber: validatedData.apartmentNumber || "",
        discountSubscribe: "",
        street: validatedData.street || "",
        isDone: false,
      });
      if (newOrder) {
        cartInfo.items.splice(0, cartInfo.items.length);
        await cartInfo.save();
        sendResponse(res, 200, { status: "success", data: newOrder });
      } else {
        throw new Error("failed to create an order");
      }
    } catch (error) {
      next(error);
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
