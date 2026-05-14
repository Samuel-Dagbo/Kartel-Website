import mongoose, { Schema, Document } from 'mongoose'

export interface ISettings extends Document {
  storeName: string
  storeEmail: string
  storePhone: string
  storeAddress: string
  currency: string
  taxRate: number
  shippingFee: number
  freeShippingThreshold: number
  orderPrefix: string
  lowStockThreshold: number
  emailNotifications: boolean
  updatedAt: Date
}

const SettingsSchema = new Schema<ISettings>(
  {
    storeName: { type: String, default: 'CARL JONES' },
    storeEmail: { type: String, default: 'hello@carljones.com' },
    storePhone: { type: String, default: '+1 (555) 123-4567' },
    storeAddress: { type: String, default: '123 Luxury Lane, New York, NY 10001' },
    currency: { type: String, default: 'GHS' },
    taxRate: { type: Number, default: 0 },
    shippingFee: { type: Number, default: 0 },
    freeShippingThreshold: { type: Number, default: 0 },
    orderPrefix: { type: String, default: 'CJ' },
    lowStockThreshold: { type: Number, default: 10 },
    emailNotifications: { type: Boolean, default: true },
  },
  { timestamps: true }
)

export default mongoose.models.Settings || mongoose.model<ISettings>('Settings', SettingsSchema)
