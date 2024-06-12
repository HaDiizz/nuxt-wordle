import { User } from "~/server/models/userModel";

export default defineEventHandler(async (event) => {
  try {
    const usersRanking = await User.find()
      .select("-password")
      .sort({ scores: "desc" });
    return { success: true, result: usersRanking };
  } catch (err) {
    return { error: true, message: "Something went wrong" };
  }
});
