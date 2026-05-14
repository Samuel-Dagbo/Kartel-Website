import mongoose, { Schema, Document } from 'mongoose'

export interface IDiscount extends Document {
  code: string
  type: 'percentage' | 'fixed'
  value: number
  minPurchase: number
  maxUses: number
  usedCount: number
  expiresAt: Date
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const DiscountSchema = new Schema<IDiscount>(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['percentage', 'fixed'],
      required: true,
    },
    value: {
      type: Number,
      required: true,
      min: 0,
    },
    minPurchase: {
      type: Number,
      default: 0,
    },
    maxUses: {
      type: Number,
      default: 0,
    },
    usedCount: {
      type: Number,
      default: 0,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
)

DiscountSchema.index({ code: 1 })
DiscountSchema.index({ isActive: 1, expiresAt: 1 })

export default mongoose.models.Discount || mongoose.model<IDiscount>('Discount', DiscountSchema)
