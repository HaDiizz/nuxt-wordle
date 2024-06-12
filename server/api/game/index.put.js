import { User } from "~/server/models/userModel";
import { getServerSession } from "#auth";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const session = await getServerSession(event);
    if (!session) return { error: true, message: "Unauthorized" };
    let user = null;
    if (body.gamesPlayed) {
      user = await User.findOneAndUpdate(
        { username: session.user.username },
        { $inc: { gamesPlayed: 1 } },
        { new: true }
      );
    }
    if (body.gamesWon && body.scores > 0) {
      user = await User.findOneAndUpdate(
        { username: session.user.username },
        { $inc: { gamesWon: 1, scores: body.scores } },
        { new: true }
      );
      return { success: true, message: "You won the game 🔥" };
    }
    if (body.gamesLost) {
      user = await User.findOneAndUpdate(
        { username: session.user.username },
        { $inc: { gamesLost: 1 } },
        { new: true }
      );
      return { success: true, message: "Oops, nice try 👻" };
    }
    if (!user) return { error: true, message: "Unauthorized" };
    return { success: true, message: "Game started. 🚀" };
  } catch (err) {
    return { error: true, message: "Something went wrong" };
  }
});
