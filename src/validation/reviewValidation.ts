import z from "zod";


export const validateCreateReviewSchema =  z.object({
    name: z.string().trim().min(1, "name is required"),
    text: z.string().trim().min(1, "text is required"),
    shouldShow: z.string().default("0"),
  });

  export const validateUpdateReviewSchema =  z.object({
    name: z.string().trim().min(1, "name is required"),
    text: z.string().trim().min(1, "text is required"),
    shouldShow: z.string().default("0"),
  });

