import z from "zod";

const addProductSchema = z.object({
  priceAfterDiscount: z.number().min(0),
  discount: z.number().min(0).optional(),
  quantity: z.number().min(0),
  title: z.string().trim().min(1),
  //   image: z.string().trim().min(1),
  stock: z.number().default(0).optional(),
  price: z.number(),
  category_id: z.string(),
  description: z.string().optional(),
  accessory_id: z.array(z.string()).optional(),
});

const editeProductSchema = addProductSchema.partial();

export { addProductSchema, editeProductSchema };
