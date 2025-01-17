import z from "zod";


export const validateCreateSubscribeSchema =  z.object({
    title: z.string().trim().min(1, "Title is required"),
    price: z.string().trim().min(1, "Title is required"),
    isFreeDelivery: z.string().default("0"),
    discount: z.string().optional(),
    features: z.array(z.string()).min(1, "Features is required"),
    image:z.string().min(1, "image id is required")
    
  });

  export const validateUpdateSubscribeSchema =  z.object({
    title: z.string().trim().min(1, "Title is required"),
    price: z.string().trim().min(1, "Title is required"),
    isFreeDelivery: z.string().default("0"),
    discount: z.string().optional(),
    features: z.array(z.string()).min(1, "Features is required"),
    deliveryFrequency: z.string().min(1, "Delivery frequency is required"),
    deliveryCount: z.string().min(1, "Delivery count is required"),
    image:z.string().optional()
    
  });

  export const validateCreateUserForSubscribeSchema =  z.object({
    deliveryFrequency: z.string().min(1, "Delivery frequency is required"),
    deliveryCount: z.string().min(1, "Delivery count is required"),
    
  });
