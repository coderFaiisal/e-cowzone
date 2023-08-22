import { Schema, model } from 'mongoose';
import { IOrder, IOrderModel } from './order.interface';

const orderSchema = new Schema<IOrder, IOrderModel>(
  {
    cow: { type: Schema.Types.ObjectId, ref: 'Cow', required: true },
    buyer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  {
    timestamps: true,
  },
);

export const Order = model<IOrder, IOrderModel>('Order', orderSchema);
