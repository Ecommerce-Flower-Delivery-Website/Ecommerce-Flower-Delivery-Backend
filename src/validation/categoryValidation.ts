//
import { z } from "zod";

export const addCategorySchema = z.object({
    title: z.string().trim().min(1, { message: "Title is required." }),
    description: z.string().trim().optional(),
});

export const editCategorySchema = z.object({
    title: z.string().trim().optional(),
    description: z.string().trim().optional(),
});
