import { Schema, model, Types } from "mongoose";

export interface ISetting {
  key: string;
  value: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const settingSchema = new Schema<ISetting>({
  key: { type: String, required: true, unique: true, trim: true },
  value: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default model<ISetting>("Setting", settingSchema);