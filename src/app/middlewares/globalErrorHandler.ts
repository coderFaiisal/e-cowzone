// /* eslint-disable no-unused-vars */
// /* eslint-disable @typescript-eslint/no-unused-vars */
// import { ErrorRequestHandler } from 'express';
// import httpStatus from 'http-status';
// import config from '../../config';
// import { IGenericErrorMessages } from '../../interfaces/error';

// const globaErrorHandler: ErrorRequestHandler = async (
//   error,
//   req,
//   res,
//   next,
// ) => {
//   let statusCode = httpStatus.INTERNAL_SERVER_ERROR;
//   let message = 'Something went wrong';
//   let errorMessages: IGenericErrorMessages[] = [];

//   res.status(statusCode).json({
//     success: false,
//     message,
//     errorMessages,
//     stack: config.env !== 'production' ? error?.stack : undefined,
//   });
// };

// export default globaErrorHandler;
