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
      data: {
        ...cart,
        items: cart.items.filter((item) => item != null),
      },
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
const removeAccessoryFromCart = async (
  req: Request & { user?: UserType },
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

    const { productId, accessoryId } = req.params;

    // Validate productId and accessoryId
    await validateIdSchema("Invalid product ID").parseAsync(productId);
    await validateIdSchema("Invalid accessory ID").parseAsync(accessoryId);

    // Check if the product exists
    if (!isProductFonud(productId)) {
      return sendResponse(res, 404, {
        status: "fail",
        message: "Product not found",
      });
    }

    const cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) {
      return sendResponse(res, 404, {
        status: "fail",
        message: "Cart not found",
      });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (itemIndex === -1) {
      return sendResponse(res, 404, {
        status: "fail",
        message: "Product not found in the cart",
      });
    }

    const item = cart.items[itemIndex];

    // Remove the specific accessory from the product's accessories
    const accessoryIndex = item.accessoriesId.findIndex(
      (accId) => accId.toString() === accessoryId
    );

    if (accessoryIndex === -1) {
      return sendResponse(res, 404, {
        status: "fail",
        message: "Accessory not found for the specified product",
      });
    }

    // Remove the accessory from the array
    item.accessoriesId.splice(accessoryIndex, 1);

    // If the product has no accessories left, you can choose to remove the product as well
    // if (item.accessoriesId.length === 0) {
    //   cart.items.splice(itemIndex, 1);
    // }

    await cart.save();

    return sendResponse(res, 204, {
      status: "success",
      data: null,
    });
  } catch (err) {
    next(err);
  }
};
const editCartItem = async (
  req: Request & { user?: UserType },
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

    const { productId } = req.params;
    const { productQuantity, accessoriesId } = req.body;

    // Validate productId
    await validateIdSchema("Invalid product ID").parseAsync(productId);

    // Check if the product exists
    if (!isProductFonud(productId)) {
      return sendResponse(res, 404, {
        status: "fail",
        message: "Product not found",
      });
    }

    // Validate accessory IDs if provided
    if (accessoriesId && Array.isArray(accessoriesId)) {
      for (const accessoryId of accessoriesId) {
        await validateIdSchema("Invalid accessory ID").parseAsync(accessoryId);

        if (!isProductFonud(accessoryId)) {
          return sendResponse(res, 404, {
            status: "fail",
            message: `Accessory with ID ${accessoryId} not found`,
          });
        }
      }
    }

    const cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) {
      return sendResponse(res, 404, {
        status: "fail",
        message: "Cart not found",
      });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (itemIndex === -1) {
      return sendResponse(res, 404, {
        status: "fail",
        message: "Product not found in the cart",
      });
    }

    const item = cart.items[itemIndex];

    // Update the product quantity if provided
    if (productQuantity !== undefined) {
      if (productQuantity <= 0) {
        return sendResponse(res, 400, {
          status: "fail",
          message: "Product quantity must be greater than 0",
        });
      }
      item.productQuantity = productQuantity;
    }

    // Update the accessory IDs if provided
    if (accessoriesId !== undefined) {
      item.accessoriesId = accessoriesId;
    }

    await cart.save();

    return sendResponse(res, 200, {
      status: "success",
      data: cart,
    });
  } catch (err) {
    next(err);
  }
};

export default {
  getCart,
  addElementToCart,
  removeElementFromCart,
  removeAccessoryFromCart,
  editCartItem,
};
