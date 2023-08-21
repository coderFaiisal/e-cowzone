import httpStatus from 'http-status';
import { ZodError, ZodIssue } from 'zod';
import { IGenerericErrorResponse } from '../interfaces/common';
import { IGenericErrorMessages } from '../interfaces/error';

const handleZodError = (error: ZodError): IGenerericErrorResponse => {
  const errors: IGenericErrorMessages[] = error?.issues?.map(
    (issue: ZodIssue) => {
      return {
        path: issue?.path[issue?.path?.length - 1],
        message: issue?.message,
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

export default handleZodError;
