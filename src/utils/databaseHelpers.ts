import Product, { TProduct } from "../models/productModel"
import Accessory from "../models/accessoryModel"
import mongoose from "mongoose";
import z from "zod";
import cartModel from "@/models/cartModel";

export const isValidObjectId = (id: string): boolean =>
  mongoose.Types.ObjectId.isValid(id);

export const validateIdSchema = (message: string) =>
  z.string().refine(
    async (id) => {
      return isValidObjectId(id);
    },
    { message }
  );

export const isProductFonud = async (id : string) => {
  try {
    const product = await Product.findById(id);
    return (product ? true : false)
  } catch {
    return false;
  }
}

/*
  This function finds the product by its ID and removes its ID from the `products_array`
  of all accessories linked to it via `accessory_id` array.
*/
export const removeProductFromAccessories  = async (product: TProduct) => {
    // Iterate through the accessories linked to the product
    for (const accessoryId of product.accessory_id) {
      const accessoryDocument = await Accessory.findById(accessoryId);
      if (!accessoryDocument) continue;

      accessoryDocument.products_array = accessoryDocument.products_array.filter(
        (id) => id !== product._id
      );

      await accessoryDocument.save();
    }
};

export const isUserHaveCart = async (userId: mongoose.Types.ObjectId) => {
  const cart = await cartModel.findOne({ userId });
  if (cart) return true;
  else return false;



  
}