import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  role: "COACH" | "ANALYST" | "ADMIN";
  avatar?: string;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: ["COACH", "ANALYST", "ADMIN"], default: "ANALYST" },
    avatar: { type: String }
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>("User", UserSchema);
