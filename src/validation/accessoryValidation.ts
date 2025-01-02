import { z } from "zod"

const accessorySchema = z.object({
  title: z.string().trim().min(1, "Title is required."),
  image: z.string().min(1, "Image URL is required."),
  stock: z.number().int().nonnegative().default(0),
  description: z.string().optional(),
  price: z.number().positive("Price must be greater than 0."),
  products_array: z.array(z.string().regex(/^[a-f\d]{24}$/i, "Invalid ObjectId.")),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export default accessorySchema;