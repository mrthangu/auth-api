import mongoose from "mongoose";

export const connectDb = async (DATABASE_URL) => {
  try {
    const DB_OPTIONS = {
      dbName: "authapi",
    };
    await mongoose.connect(DATABASE_URL, DB_OPTIONS);
    console.log("DB Connected");
  } catch (error) {
    console.log(error);
  }
};
