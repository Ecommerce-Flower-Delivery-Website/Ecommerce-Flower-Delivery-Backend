import { z } from "zod";

const addGiftDiscountValidation = z.object({
  codeGift: z.string(),
  discountGift: z.number(),
});

const updateGiftDiscountValidation = addGiftDiscountValidation.partial();

export { addGiftDiscountValidation, updateGiftDiscountValidation };
