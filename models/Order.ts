import mongoose, { Schema, Document } from 'mongoose'

export interface IOrder extends Document {
  user?: mongoose.Schema.Types.ObjectId
  orderNumber: string
  items: {
    product: mongoose.Schema.Types.ObjectId
    quantity: number
    price: number
  }[]
  shippingAddress: {
    email: string
    name?: string
    street: string
    city: string
    state: string
    zip: string
    country: string
    phone: string
  }
  totalAmount: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  paymentStatus: 'pending' | 'completed' | 'failed'
  paymentMethod?: string
  stripePaymentId?: string
  trackingNumber?: string
  createdAt: Date
  updatedAt: Date
}

const OrderSchema = new Schema<IOrder>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: false,
      index: true,
    },
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    items: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    shippingAddress: {
      email: { type: String, required: true },
      name: { type: String },
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zip: { type: String, required: true },
      country: { type: String, required: true },
      phone: { type: String, required: true },
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
    },
    paymentMethod: {
      type: String,
      enum: ['cod', 'card', 'transfer'],
      default: 'cod',
    },
    stripePaymentId: String,
    trackingNumber: String,
  },
  {
    timestamps: true,
  }
)

OrderSchema.index({ createdAt: -1 })
OrderSchema.index({ status: 1 })
OrderSchema.index({ 'shippingAddress.email': 1 })

export default mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema)