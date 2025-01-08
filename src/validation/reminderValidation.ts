import z from "zod";

export const reminderSchema = z.object({
  text: z.string(),
  festivalName: z.string(),
  festivalDate: z.date(),
});
