import { isValidObjectId } from "mongoose";
import { z } from "zod"

export const accessorySchema = z.object({
  title: z.string().trim().min(1, "Title is required."),
  stock: z.string(),
  description: z.string().optional(),
  price: z.string(),
  products_array: z.string().refine((products_array_string) => { 
    const products_array_parsed = JSON.parse(products_array_string);
    if (!Array.isArray(products_array_parsed)) return false;

    for (const productId of products_array_parsed) {
      if (!isValidObjectId(productId)) return false;
    }

    return true;
   }, { message: "Invalid products array" }).optional(),
});

export const updateAccessorySchema = z.object({
  title: z.string().trim().min(1, "Title is required.").optional(),
  stock: z.string().optional(),
  description: z.string().optional(),
  price: z.string().optional(),
  products_array: z.string().refine((products_array_string) => { 
    const products_array_parsed = JSON.parse(products_array_string);
    if (!Array.isArray(products_array_parsed)) return false;

    for (const productId of products_array_parsed) {
      if (!isValidObjectId(productId)) return false;
    }

    return true;
   }, { message: "Invalid products array" }).optional(),
  
  });