import mongoose, { Document, Model } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET!;

// Document interface (for individual user documents)
interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: "Manager" | "Employee";
  createdAt: Date;
  updatedAt: Date;
  generateAuthToken: () => string;
  comparePassword: (password: string) => Promise<boolean>;
}

// Model interface (for custom static methods)
interface IUserModel extends Model<IUser> {
  hashPassword: (password: string) => Promise<string>;
}

// Schema
const userSchema = new mongoose.Schema<IUser>({
  name: { type: String, required: true, minlength: 3 },
  email: { type: String, required: true, unique: true, minlength: 5 },
  password: { type: String, required: true, select: false },
  role: { type: String, enum: ["Manager", "Employee"], required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Instance methods
userSchema.methods.generateAuthToken = function () {
  return jwt.sign({ _id: this._id }, JWT_SECRET);
};

userSchema.methods.comparePassword = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

// Static method
userSchema.statics.hashPassword = async function (password: string) {
  return await bcrypt.hash(password, 10);
};

// Export model with custom interface
export const userModel = mongoose.model<IUser, IUserModel>("user", userSchema);
