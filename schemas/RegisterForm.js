import { toTypedSchema } from "@vee-validate/zod";
import * as zod from "zod";

export const RegisterFormSchema = toTypedSchema(
  zod
    .object({
      username: zod
        .string()
        .min(3, { message: "Username must be at least 3 characters" }),
      email: zod
        .string()
        .min(1, { message: "Email is required" })
        .email("Invalid email address"),
      password: zod
        .string()
        .min(6, { message: "Password must be at least 6 characters" }),
      confirmPassword: zod
        .string()
        .min(6, { message: "Password must be at least 6 characters" }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      path: ["confirmPassword"],
      message: "Password does not match",
    })
);
