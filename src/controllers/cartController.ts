import Cart, { TCart } from "../../src/models/cartModel";
import { NextFunction, Request, Response } from "express";
import { sendResponse } from "@/utils/sendResponse";
import { TProduct } from "@/models/productModel";
import { TAccessory } from "@/models/accessoryModel";
import { UserType } from "@/models/userModel";
import { addEelementToCartValidation } from "@/validation/cartValidation";
import { isProductFonud, validateIdSchema } from "@/utils/databaseHelpers";

// Retrieves and processes the user's cart:
// - Verifies user authentication.
// - Fetches cart with product and accessory details from the database.
// - Calculates total price and handles missing products/accessories.
// - Updates cart with total price and product count, then returns the data or an error.
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

    const cart = (await Cart.findOne({ userId: req.user._id })
      .populate({
        path: "items.productId",
        select: "price title image",
      })
      .populate({
        path: "items.accessoriesId",
        select: "price title image",
      })
      .select("-__v -userId")

      // Use `.lean()` to return a plain JavaScript object instead of a Mongoose document, improving performance.
      .lean()) as TCart | null;

    if (!cart) {
      return sendResponse(res, 404, {
        status: "fail",
        message: "cart is not found",
      });
    }

    let priceAll = 0,
      productsCount = 0;

    // Loop through each cart item and calculate price, handling missing products/accessories
    for (let i = 0; i < cart.items.length; i++) {
      const item = cart.items[i];

      const product = item.productId as unknown as TProduct | null;
      //if product removed by admin
      if (!product) {
        delete cart.items[i];
        continue;
      }

      // Accumulate product quantity to the total count
      productsCount += cart.items[i].productQuantity;

      let priceCartItem = Number(product.price); // Start with the product price

      const accessories = item.accessoriesId as unknown as
        | TAccessory[]
        | undefined;
      if (accessories) {
        for (let j = 0; j < accessories.length; j++) {
          //if accessory removed by admin
          if (!accessories[j]) {
            delete cart.items[i].accessoriesId[j];
            continue;
          }
          
          priceCartItem += Number(accessories[j].price); // Add accessory price to the cart item total
        }
      }
      // Set the final price for the current cart item
      cart.items[i].price = priceCartItem;

      // Add this item’s price to the total cart price
      priceAll += priceCartItem;
    }

    // Update the cart with the calculated total price and products count
    cart.priceAll = priceAll;
    cart.productsCount = productsCount;

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

    const { productId, productQuantity, accessoriesId } = req.body;
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
      productQuantity,
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
