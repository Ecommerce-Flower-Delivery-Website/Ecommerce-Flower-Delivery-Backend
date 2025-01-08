import z from "zod";

const addProductSchema = z.object({
  priceAfterDiscount: z.string().min(0),
  discount: z.string().min(0).optional(),
  quantity: z.string().min(0),
  title: z.string().trim().min(1),
  image: z.string().trim().min(1),
  stock: z.string().optional(),
  price: z.string(),
  category_id: z.string(),
  description: z.string().optional(),
  accessory_id: z.array(z.string()).optional(),
});

const editeProductSchema = addProductSchema.partial();

export { addProductSchema, editeProductSchema };
