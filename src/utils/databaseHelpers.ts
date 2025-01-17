import Product from "../models/productModel"
import Accessory from "../models/accessoryModel"
import mongoose from "mongoose";
import z from "zod";

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

export const isAccessoryFonud = async (id : string) => {
  try {
    const accessory = await Accessory.findById(id);
    return (accessory ? true : false)
  } catch {
    return false;
  }
}