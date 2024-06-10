import { toTypedSchema } from "@vee-validate/zod";
import * as zod from "zod";

export const LoginFormSchema = toTypedSchema(
  zod.object({
    username: zod
      .string()
      .min(3, { message: "Username must be at least 3 characters" }),
    password: zod
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
  })
);
