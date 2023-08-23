import httpStatus from 'http-status';
import { SortOrder, startSession } from 'mongoose';
import ApiError from '../../../errors/ApiError';
import { PaginationHelper } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { Cow } from '../cow/cow.model';
import { User } from '../user/user.model';
import { IOrder } from './order.interface';
import { Order } from './order.model';

const createOrder = async (order: IOrder): Promise<IOrder> => {
  let newOrderAllData;

  //start transaction operation
  const session = await startSession();
  try {
    session.startTransaction();
    const cow = await Cow.findById(order.cow);
    const buyer = await User.findById(order.buyer);
    const seller = await User.findById(cow?.seller);

    const cowPrice = cow ? cow.price : 0;
    const newBuyerBudget = buyer ? buyer.budget - cowPrice : 0;
    const newSellerIncome = seller ? seller?.income + cowPrice : 0;

    //checking buyer ability for buying cow
    if (buyer && cow && buyer.budget < cowPrice) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'You have to need more budget to buy this cow!',
      );
    }

    //update cow status
    await Cow.findByIdAndUpdate(
      order.cow,
      {
        label: 'sold out',
      },
      { session: session },
    );

    //update buyer budget
    await User.findByIdAndUpdate(
      order.buyer,
      {
        budget: newBuyerBudget,
      },
      { session: session },
    );

    //update seller income
    await User.findByIdAndUpdate(
      cow?.seller,
      {
        income: newSellerIncome,
      },
      { session: session },
    );

    //save order
    const newOrder = await Order.create([order], { session });
    newOrderAllData = (await newOrder[0].populate('cow')).populate('buyer');

    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
  return newOrderAllData;
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
    .populate({
      path: 'cow',
      populate: [{ path: 'seller' }],
    })
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
