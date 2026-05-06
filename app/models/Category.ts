import { Schema, model, Types } from "mongoose";

export interface ICategory {
  name: string;
  slug: string;
  description?: string;
  parentCategory?: Types.ObjectId | string;
  image?: string;
  isFeatured?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const categorySchema = new Schema<ICategory>({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  description: { type: String },
  parentCategory: { type: Schema.Types.ObjectId, ref: "Category" },
  image: { type: String },
  isFeatured: { type: Boolean, default: false },
});

export default model<ICategory>("Category", categorySchema);