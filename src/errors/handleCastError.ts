import httpStatus from 'http-status';
import mongoose from 'mongoose';
import { IGenerericErrorResponse } from '../interfaces/common';
import { IGenericErrorMessages } from '../interfaces/error';

const handleCastError = (
  error: mongoose.Error.CastError,
): IGenerericErrorResponse => {
  const errors: IGenericErrorMessages[] = [
    {
      path: error?.path,
      message: 'Invalid Id',
    },
  ];
  const statusCode = httpStatus.BAD_REQUEST;
  return {
    statusCode,
    message: 'Cast Error',
    errorMessages: errors,
  };
};

export default handleCastError;
