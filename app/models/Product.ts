import { Schema, model, Types } from "mongoose";

export interface IProduct {
  name: string;
  sku?: string;
  brand: string;
  category: Types.ObjectId | string;
  description: string;
  notes: string;
  fragranceNotes: string[];
  longevity: string;
  sillage: string;
  price: number;
  discountPrice?: number;
  costPrice?: number;
  sizes: string[];
  quantity: number;
  images: string[];
  featured: boolean;
  status: "active" | "inactive" | "archived";
  createdAt?: Date;
  updatedAt?: Date;
}

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    sku: { type: String },
    brand: { type: String, required: true, trim: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    description: { type: String, required: true },
    notes: { type: String },
    fragranceNotes: { type: [String], default: [] },
    longevity: { type: String },
    sillage: { type: String },
    price: { type: Number, required: true },
    discountPrice: { type: Number },
    costPrice: { type: Number, required: true },
    sizes: { type: [String], required: true },
    quantity: { type: Number, required: true },
    images: { type: [String], required: true },
    featured: { type: Boolean, default: false },
    status: { 
      type: String, 
      enum: ["active", "inactive", "archived"], 
      default: "active" 
    },
  },
  { timestamps: true }
);

export default model<IProduct>("Product", productSchema);