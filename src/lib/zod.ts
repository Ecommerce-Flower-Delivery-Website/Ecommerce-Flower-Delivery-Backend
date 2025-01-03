import z from "zod";
const userNameZodSchema = z
  .string({
    required_error: "user name is required",
    invalid_type_error: "user name must be a string",
  })
  .min(3, "user name cannot be less than 3 character ")
  .max(24, "user name cannot be more than 24 character ");

const passwordZodSchema = (name = "password") =>
  z
    .string({
      invalid_type_error: `${name} must be a string`,
      required_error: `${name} is required`,
    })
    .min(8, `${name} cannot be less than 8 character `)
    .max(24, `${name} cannot be more than 24 character `);
// .refine((value) => {
//   return /(?=.*[A-Z])(?=.*\d)/.test(value);
// }, `${name} must have at least one capital and one number`);
const userEmailSchema = z
  .string({
    required_error: "email is required",
    invalid_type_error: "wrong email format",
  })
  .email("email is required");
export const validateSchemas = {
  signup: z
    .object({
      name: userNameZodSchema,
      email: userEmailSchema,
      phone: z.string().min(6).max(24),
      role: z.string().default("user"),
      profile_image: z
        .string({ required_error: "profile image is required" })
        .min(1, "profile image cannot be empty"),
      password: passwordZodSchema(),
      password_confirmation: passwordZodSchema("password confirmation"),
    })
    .refine(
      (data: { password: string; password_confirmation: string }) =>
        data.password === data.password_confirmation,
      {
        message: "Passwords don't match",
        path: ["password_confirmation"],
      }
    ),
  login: z.object({
    email: userEmailSchema,
    password: passwordZodSchema(),
  }),
  
};
//
