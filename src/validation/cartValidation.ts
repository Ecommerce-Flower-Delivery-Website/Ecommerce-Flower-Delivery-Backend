import { validateIdSchema } from "@/utils/databaseHelpers";
import { z } from "zod"

export const addEelementToCartValidation = z.object({
    productId: validateIdSchema("product ID is not valid"),
    accessoriesId: z.array(validateIdSchema("accessory ID is not valid")).optional(),
});
