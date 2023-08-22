import { IOrder } from './order.interface';
import { Order } from './order.model';

const createOrder = async (order: IOrder): Promise<IOrder> => {
  const result = (await (await Order.create(order)).populate('cow')).populate(
    'buyer',
  );
  return result;
};

const getAllOrders = async (): Promise<IOrder[]> => {
  const result = await Order.find().populate('cow').populate('buyer');
  return result;
};

export const OrderService = {
  createOrder,
  getAllOrders,
};
