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

const createOrderSchema = z.object({
  discountGift: z
    .number({ invalid_type_error: "Discount gift must be a number" })
    .optional(),
  discountSubscribe: z
    .number({ invalid_type_error: "Discount subscribe must be a number" })
    .optional(),
  cart_id: z
    .string({ invalid_type_error: "Cart ID must be a string" })
    .min(1, { message: "Cart ID is required" }),
  recipientName: z
    .string({ invalid_type_error: "Recipient name must be a string" })
    .min(1, { message: "Recipient name is required" }),
  recipientPhone: z
    .string({ invalid_type_error: "Recipient phone must be a string" })
    .min(1, { message: "Recipient phone is required" })
    .regex(/^\+?[1-9]\d{1,14}$/, {
      message: "Recipient phone must be a valid phone number",
    }),
  dateDelivery: z
    .string({
      invalid_type_error: "Delivery date must be a string in dd/mm/yyyy format",
    })
    .regex(/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/, {
      message: "Delivery date must be in the format dd/mm/yyyy",
    })
    .refine(
      (date) => {
        const [day, month, year] = date.split("/").map(Number);
        const parsedDate = new Date(year, month - 1, day);
        return parsedDate > new Date();
      },
      { message: "Delivery date must be in the future" }
    ),
  timeDelivery: z
    .string({ invalid_type_error: "Delivery time must be a string" })
    .min(1, { message: "Delivery time is required" }),
  address: z.object({
    street: z
      .string({ invalid_type_error: "Street must be a string" })
      .min(1, { message: "Street is required" }),
    apartmentNumber: z
      .number({ invalid_type_error: "Apartment number must be a number" })
      .positive({ message: "Apartment number must be greater than zero" }),
  }),
  doesKnowAddress: z.boolean().optional(),
  cardNumber: z
    .string({ invalid_type_error: "Card number must be a string" })
    .min(1, { message: "Card number is required" })
    .regex(/^\d{16}$/, { message: "Card number must be exactly 16 digits" }),
  cvvCode: z
    .string({ invalid_type_error: "CVV code must be a string" })
    .min(1, { message: "CVV code is required" })
    .regex(/^\d{3}$/, { message: "CVV code must be exactly 3 digits" }),
});

const updateOrderSchema = createOrderSchema.partial();

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
  createOrderSchema,
  updateOrderSchema,
};
