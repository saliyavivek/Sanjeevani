const { z } = require("zod");

const userRegistrationSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
  phoneno: z
    .string()
    .regex(/^\d{10}$/, { message: "Phone number must be 10 digits" }),
  role: z.enum(["farmer", "admin"]).optional().default("farmer"),
});

const userLoginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

module.exports = { userRegistrationSchema, userLoginSchema };
