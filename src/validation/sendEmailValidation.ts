import z from "zod";

export const mailOptionsSchema = z.object({
  from: z.string(),
  to: z.string().email(),
  subject: z.string(),
  text: z.string(),
});
