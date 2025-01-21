import { z } from "zod";

// const productSchema = z.object({
//   description: z.string(),
//   title: z.string(),
//   image: z.string(),
//   discount: z.number().optional(),
//   price: z.number(),
// });

// Create Order schema
const createOrderSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(1, "Phone number is required"),
    recipientName: z.string().min(1, "Recipient name is required"),
    recipientPhone: z.string().min(10, "Valid phone number is required"),
    deliveryDate: z.string().min(1, "Delivery date is required"),
    deliveryTime: z.string().min(1, "delivery time time is required"),
    discountGift: z
      .string()
      .min(1, "discount gift time is required")
      .optional(),
    street: z.string().optional(),
    apartmentNumber: z.string().optional(),
    dontKnowAddress: z.boolean().default(false),
    cardNumber: z.string().regex(/^\d{16}$/, "Card number must be 16 digits"),
    expiryDate: z
      .string()
      .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Expiry date must be in MM/YY format"),
    cvv: z.string().regex(/^\d{3,4}$/, "CVV must be 3 or 4 digits"),
  })
  .refine(
    (data) => {
      // Only require street if dontKnowAddress is false
      if (!data.dontKnowAddress) {
        if (!data.street) {
          return false;
        }
      }
      return true;
    },
    {
      message: "Street is required unless 'don't know address' is checked",
      path: ["street"],
    }
  );

export { createOrderSchema };
