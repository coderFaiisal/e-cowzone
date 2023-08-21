import httpStatus from 'http-status';
import mongoose from 'mongoose';
import { IGenerericErrorResponse } from '../interfaces/common';
import { IGenericErrorMessages } from '../interfaces/error';

const handleValidationError = (
  error: mongoose.Error.ValidationError,
): IGenerericErrorResponse => {
  const errors: IGenericErrorMessages[] = Object.values(error?.errors).map(
    (element: mongoose.Error.ValidatorError | mongoose.Error.CastError) => {
      return {
        path: element?.path,
        message: element?.message,
      };
    },
  );
  const statusCode = httpStatus.BAD_REQUEST;
  return {
    statusCode,
    message: 'Validation Error',
    errorMessages: errors,
  };
};

export default handleValidationError;
