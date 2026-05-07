import mongoose, { Schema, Document } from 'mongoose'

export interface IInventoryLog extends Document {
  product: mongoose.Schema.Types.ObjectId
  type: 'addition' | 'removal' | 'adjustment'
  quantity: number
  previousQuantity: number
  newQuantity: number
  reason: string
  order?: mongoose.Schema.Types.ObjectId
  user: mongoose.Schema.Types.ObjectId
  createdAt: Date
}

const InventoryLogSchema = new Schema<IInventoryLog>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['addition', 'removal', 'adjustment'],
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    previousQuantity: {
      type: Number,
      required: true,
    },
    newQuantity: {
      type: Number,
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    order: {
      type: Schema.Types.ObjectId,
      ref: 'Order',
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

InventoryLogSchema.index({ product: 1, createdAt: -1 })
InventoryLogSchema.index({ type: 1 })

export default mongoose.models.InventoryLog || mongoose.model<IInventoryLog>('InventoryLog', InventoryLogSchema)
