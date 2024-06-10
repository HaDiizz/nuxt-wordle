import mongoose from "mongoose";

export default async () => {
  const config = useRuntimeConfig();
  try {
    await mongoose.connect(config.dbURI);
    console.log("Connected to MONGODB");
  } catch (err) {
    console.log(err);
  }
};
