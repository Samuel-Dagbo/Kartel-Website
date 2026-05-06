import { Schema, model, Types } from "mongoose";

export interface IOrderItem {
  productId: Types.ObjectId;
  name: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface IOrder {
  _id?: Types.ObjectId;
  userId: Types.ObjectId;
  orderNumber: string;
  totalAmount: number;
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
  items: IOrderItem[];
  createdAt?: Date;
  updatedAt?: Date;
}

const orderItemSchema = new Schema<IOrderItem>({
  productId: { type: Schema.Types.ObjectId, required: true },
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  subtotal: { type: Number, required: true },
});

const orderSchema = new Schema<IOrder>({
  userId: { type: Schema.Types.ObjectId, required: true },
  orderNumber: { type: String, required: true, unique: true },
  totalAmount: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"],
    default: "pending"
  },
  items: { type: [orderItemSchema], required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

orderSchema.pre("save", function (next) {
  if (this.isModified("items")) {
    this.totalAmount = this.items.reduce((sum, item) => sum + item.subtotal, 0);
  }
  next();
});

export default model<IOrder>("Order", orderSchema);