import { Model, Types } from 'mongoose';

export type IOrder = {
  cow: Types.ObjectId;
  buyer: Types.ObjectId;
};

export type IOrderModel = Model<IOrder, Record<string, unknown>>;
