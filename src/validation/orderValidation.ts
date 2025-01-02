import { z } from "zod";

// Address schema
const addressSchema = z.object({
  street: z.string().optional(),
  apartmentNumber: z.number().optional(),
});
// Product schema

const productSchema = z.object({
  description: z.string(),
  title: z.string(),
  image: z.string(),
  discount: z.number().optional(),
  price: z.number(),
});

// Create Order schema
const createOrderSchema = z.object({
  totalAmount: z.number(),
  discountGift: z.number().optional(),
  discountSubscribe: z.number().optional(),
  cart_id: z.string(), // Assuming the `cart_id` is passed as a string
  recipientName: z.string(),
  recipientPhone: z.string(),
  dateDelivery: z.string(),
  timeDelivery: z.string(),
  address: addressSchema,
  doesKnowAddress: z.boolean().optional().default(true),
  cardNumber: z.string(),
  cvvCode: z.string(),
});

// Edit Order schema
const editOrderSchema = z.object({
  array_product: z.array(productSchema).optional(),
  totalAmount: z.number().optional(),
  discountGift: z.number().optional(),
  discountSubscribe: z.number().optional(),
  cart_id: z.string().optional(),
  recipientName: z.string().optional(),
  recipientPhone: z.string().optional(),
  dateDelivery: z.date().optional(),
  timeDelivery: z.string().optional(),
  address: addressSchema.optional(),
  doesKnowAddress: z.boolean().optional(),
  cardNumber: z.string().optional(),
  cvvCode: z.string().optional(),
});

export { createOrderSchema, editOrderSchema };
