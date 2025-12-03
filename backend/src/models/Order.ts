import { Schema, model, Document, Types } from 'mongoose';

export type OrderStatus = 'pending' | 'paid' | 'cancelled';

export interface IOrder extends Document {
  user: Types.ObjectId;
  package: Types.ObjectId;
  amount: number;
  status: OrderStatus;
  markedBy?: Types.ObjectId;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new Schema<IOrder>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    package: { type: Schema.Types.ObjectId, ref: 'Package', required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'paid', 'cancelled'], default: 'pending' },
    markedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    notes: { type: String }
  },
  { timestamps: true }
);

orderSchema.index({ status: 1, user: 1 });

const Order = model<IOrder>('Order', orderSchema);

export default Order;

