import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import { startSession } from 'mongoose';
import ApiError from '../../../errors/ApiError';
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
    await session.endSession();
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }
  return newOrderAllData;
};

const getAllOrders = async (user: JwtPayload | null): Promise<IOrder[]> => {
  if (user?.role === 'buyer') {
    const buyerOrders = await Order.find({ buyer: user._id })
      .populate({
        path: 'cow',
        populate: [
          {
            path: 'seller',
          },
        ],
      })
      .populate('buyer');

    return buyerOrders;
  }

  if (user?.role === 'seller') {
    const sellerCows = await Cow.find({ seller: user._id }, { _id: 1 }).lean();

    const sellerOrders = await Order.find({ cow: { $in: sellerCows } })
      .populate({
        path: 'cow',
        populate: [
          {
            path: 'seller',
          },
        ],
      })
      .populate('buyer');
    return sellerOrders;
  }

  const result = await Order.find()
    .populate({
      path: 'cow',
      populate: [
        {
          path: 'seller',
        },
      ],
    })
    .populate('buyer');

  return result;
};

const getSingleOrder = async (
  id: string,
  user: JwtPayload | null,
): Promise<IOrder | null> => {
  //check order
  const order = await Order.findById(id)
    .populate({
      path: 'cow',
      populate: [
        {
          path: 'seller',
        },
      ],
    })
    .populate('buyer');

  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order does not found!');
  }

  const { buyer, cow } = order;

  if (user?.role === 'buyer') {
    //check authentic buyer
    if (buyer._id != user._id) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden Access!');
    }

    return order;
  }

  if (user?.role === 'seller') {
    const soldCow = await Cow.findById(cow._id).lean();

    if (soldCow?.seller != user._id) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden Access!');
    }

    return order;
  }

  return order;
};

export const OrderService = {
  createOrder,
  getAllOrders,
  getSingleOrder,
};
