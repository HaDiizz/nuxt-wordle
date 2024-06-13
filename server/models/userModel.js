import { Schema, model } from "mongoose";

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    length: [3, "Username must be at least 3 characters long"],
  },
  password: {
    type: String,
    required: true,
    length: [6, "Password must be at least 8 characters long"],
  },
  scores: { type: Number, default: 0 },
  gamesPlayed: { type: Number, default: 0 },
  gamesWon: { type: Number, default: 0 },
  gamesLost: { type: Number, default: 0 },
});

export const User = model("user", UserSchema);
