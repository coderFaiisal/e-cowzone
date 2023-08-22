import { SortOrder, startSession } from 'mongoose';
import { PaginationHelper } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IOrder } from './order.interface';
import { Order } from './order.model';

const createOrder = async (order: IOrder): Promise<IOrder> => {
  let allOrdersData;
  const session = await startSession();
  try {
    session.startTransaction();
    const newOrder = (
      await (await Order.create(order)).populate('cow')
    ).populate('buyer');
    allOrdersData = newOrder;

    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
  return allOrdersData;
};

const getAllOrders = async (
  options: IPaginationOptions,
): Promise<IGenericResponse<IOrder[]>> => {
  const { page, limit, skip, sortBy, sortOrder } =
    PaginationHelper.calculatePagination(options);

  const sortConditions: { [key: string]: SortOrder } = {};
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  const result = await Order.find()
    .sort(sortConditions)
    .skip(skip)
    .limit(limit)
    .populate('cow')
    .populate('buyer');

  const total = await Order.countDocuments();

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

export const OrderService = {
  createOrder,
  getAllOrders,
};
