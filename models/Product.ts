import mongoose, { Schema, Document } from 'mongoose'

export interface IProduct extends Document {
  name: string
  slug: string
  description: string
  price: number
  comparePrice?: number
  images: string[]
  category: 'mens' | 'womens' | 'unisex' | 'niche'
  brand: string
  notes: {
    top: string[]
    middle: string[]
    base: string[]
  }
  size: string
  concentration: 'EDT' | 'EDP' | 'Parfum'
  quantity: number
  inStock: boolean
  featured: boolean
  new?: boolean
  rating: number
  reviewCount: number
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

const ProductSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      index: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    comparePrice: {
      type: Number,
      min: 0,
    },
    images: {
      type: [String],
      required: true,
      validate: [(val: string[]) => val.length > 0, 'At least one image is required'],
    },
    category: {
      type: String,
      enum: ['mens', 'womens', 'unisex', 'niche'],
      required: true,
      index: true,
    },
    brand: {
      type: String,
      required: true,
      index: true,
    },
    notes: {
      top: [String],
      middle: [String],
      base: [String],
    },
    size: {
      type: String,
      required: true,
    },
    concentration: {
      type: String,
      enum: ['EDT', 'EDP', 'Parfum'],
      required: true,
    },
    quantity: {
      type: Number,
      default: 0,
      min: 0,
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    new: {
      type: Boolean,
      default: false,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    tags: [String],
  },
  {
    timestamps: true,
  }
)

ProductSchema.index({ name: 'text', description: 'text', brand: 'text', tags: 'text' })

export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema)
