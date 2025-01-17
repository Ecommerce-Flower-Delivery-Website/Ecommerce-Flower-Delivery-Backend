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

const userPhoneZodSchema = z.string().min(6).max(24).optional();

export const validateSchemas = {
  signup: z.object({
    name: userNameZodSchema,
    email: userEmailSchema,
    phone: userPhoneZodSchema,
    isAdmin: z.boolean().default(false),
    password: passwordZodSchema(),
  }),
  login: z.object({
    email: userEmailSchema,
    password: passwordZodSchema(),
  }),
};

export const userUpdateSchema = z.object({
  name: userNameZodSchema.optional(),
  email: userEmailSchema.optional(),
  phone: userPhoneZodSchema.optional(),
  password: passwordZodSchema().optional(),
  subscribe_id: z.string().optional(),
});



export const validateVerifyCodeSchema =  z.object({
  emailConfirmToken: z.string().trim().min(1, "Verification Code is required"),
  email: z.string().trim().min(1, " Email is required"),

  });

  export const validateForgetPasswordSchema =  z.object({
    email: z.string().trim().min(1, " Email is required"),

    });