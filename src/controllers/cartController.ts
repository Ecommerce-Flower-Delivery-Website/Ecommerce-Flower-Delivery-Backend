import Cart, { TCart } from "../../src/models/cartModel";
import { NextFunction, Request, Response } from "express";
import { sendResponse } from "@/utils/sendResponse";
import { TProduct } from "@/models/productModel";
import { TAccessory } from "@/models/accessoryModel";
import { subscribeType } from "@/models/subscribeModel";
import { User, UserType } from "@/models/userModel";
import { addEelementToCartValidation } from "@/validation/cartValidation";
import { isProductFonud, validateIdSchema } from "@/utils/databaseHelpers";

const getCart = async (
  req: Request & {
    user?: UserType;
  },
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return sendResponse(res, 401, {
        status: "fail",
        message: "Unauthorized: No user found",
      });
    }

    const user = (await User.findById(req.user._id)
      .populate({
        path: "subscribe_id",
        select: "subscribe_id",
      })
      .lean()) as UserType;

    const cart = (await Cart.findOne({ userId: req.user._id })
      .populate({
        path: "items.productId",
        select: "price priceAfterDiscount title image -_id",
      })
      .populate({
        path: "items.accessoriesId",
        select: "price title image -_id",
      })
      .select("-__v -_id -userId")
      .lean()) as TCart | null;

    if (!cart) {
      return sendResponse(res, 404, {
        status: "fail",
        message: "cart is not found",
      });
    }

    const cartItems = cart.items;
    const subscribe = user.subscribe_id as subscribeType | undefined;
    let priceAll = 0,
      priceAllAfterDiscount = 0;

    for (let i = 0; i < cartItems.length; i++) {
      const item = cartItems[i];
      const product = item.productId as TProduct;
      let priceCartItem = Number(product.price);
      let priceCartItemAfterDiscount = Number(product.priceAfterDiscount);

      const accessories = item.accessoriesId as TAccessory[] | undefined;

      if (accessories) {
        for (let j = 0; j < accessories.length; j++) {
          priceCartItem += accessories[j].price;
          priceCartItemAfterDiscount += accessories[j].price; // Assuming no discount for accessories
          delete (cart.items[i].accessoriesId[j] as { price?: string }).price;
        }
      }

      if (subscribe && subscribe.discount) {
        const productDiscountBySubscription =
          priceCartItem - (priceCartItem * 100) / Number(subscribe.discount);
        priceCartItemAfterDiscount -= productDiscountBySubscription;
      }

      cart.items[i].price = priceCartItem;
      cart.items[i].priceAfterDiscount = priceCartItemAfterDiscount;

      priceAll += priceCartItem;
      priceAllAfterDiscount += priceCartItemAfterDiscount;

      delete (cart.items[i].productId as { price?: string }).price;
      delete (cart.items[i].productId as { priceAfterDiscount?: string })
        .priceAfterDiscount;
    }

    cart.priceAll = priceAll;
    cart.priceAllAfterDiscount = priceAllAfterDiscount;

    return sendResponse(res, 200, {
      status: "success",
      data: cart,
    });
  } catch (err) {
    next(err);
  }
};

const addElementToCart = async (
  req: Request & {
    user?: UserType;
  },
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      return sendResponse(res, 401, {
        status: "fail",
        message: "Unauthorized: No user found",
      });
    }

    const { productId, accessoriesId } = req.body;
    await addEelementToCartValidation.parseAsync(req.body);

    if (!isProductFonud(productId)) {
      return sendResponse(res, 404, {
        status: "fail",
        message: "product is not found",
      });
    }

    for (const accessoryId of accessoriesId) {
      if (!isProductFonud(accessoryId)) {
        return sendResponse(res, 404, {
          status: "fail",
          message: `accessory with id: ${accessoryId} is not found`,
        });
      }
    }

    const cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) {
      return sendResponse(res, 404, {
        status: "fail",
        message: "cart is not found",
      });
    }

    cart.items.push({
      productId,
      accessoriesId,
    });

    await cart.save();

    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};

const removeElementFromCart = async (
  req: Request & {
    user?: UserType;
  },
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      return sendResponse(res, 401, {
        status: "fail",
        message: "Unauthorized: No user found",
      });
    }

    const productId = req.params.productId;

    await validateIdSchema("product id is not valid").parseAsync(productId);

    if (!isProductFonud(productId)) {
      return sendResponse(res, 404, {
        status: "fail",
        message: "Product is not found",
      });
    }

    const cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) {
      return sendResponse(res, 404, {
        status: "fail",
        message: "Cart is not found",
      });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (itemIndex === -1) {
      return sendResponse(res, 404, {
        status: "fail",
        message: "Item not found in the cart",
      });
    }

    cart.items.splice(itemIndex, 1);

    await cart.save();

    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};

export default {
  getCart,
  addElementToCart,
  removeElementFromCart,
};
