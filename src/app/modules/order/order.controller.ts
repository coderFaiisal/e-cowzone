import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';

const createOrder = catchAsync(async (req: Request, res: Response) => {
  const { ...orderData } = req.body;
  console.log(orderData);
  //   const result = await OrderService.createOrder(orderData);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Order completed successfully',
    // data: result,
  });
});

export const OrderController = {
  createOrder,
};
