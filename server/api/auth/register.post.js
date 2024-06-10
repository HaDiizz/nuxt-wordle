import { User } from "~/server/models/userModel";
import bcrypt from "bcrypt";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  if (
    !body.email ||
    !body.username ||
    !body.password ||
    !body.confirmPassword
  ) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      message: "Missing require fields",
    });
  }

  if (body.password !== body.confirmPassword) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      message: "Password does not match",
    });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(body.password, salt);

  const user = await User.create({
    password: hashedPassword,
    email: body.email,
    username: body.username,
  });

  return { ...user.toObject(), password: "" };
});
