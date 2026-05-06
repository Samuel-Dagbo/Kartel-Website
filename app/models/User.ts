import { Schema, model, Types } from "mongoose";
import bcrypt from "bcryptjs";

export const ROLES = ["Owner", "Manager", "Cashier", "Staff"] as const;
export type Role = typeof ROLES[number];

export interface IUser {
  _id?: Types.ObjectId;
  name: string;
  email: string;
  passwordHash: string;
  role: Role;
  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  role: { 
    type: String, 
    enum: ROLES,
    default: "Staff"
  },
}, { timestamps: true });

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("passwordHash")) return next();
  const salt = await bcrypt.genSalt(10);
  this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
  next();
});

// Method to compare password
userSchema.methods.comparePassword = async function (password: string) {
  return bcrypt.compare(password, this.passwordHash);
};

export default model<IUser>("User", userSchema);