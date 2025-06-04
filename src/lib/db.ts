import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const DB_URL = process.env.DB_URL;

export const DbConnect = async () => {
  try {
    console.log(DB_URL);
    if (!DB_URL) throw new Error("Please Provide Valid Database URL");
    await mongoose.connect(DB_URL);
    console.log(`Datbase Connected Succesfully`);
  } catch (err: any) {
    throw err;
  }
};
