import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { IUser } from '../user/user.interface';
import { User } from '../user/user.model';

const createUser = async (user: IUser): Promise<IUser> => {
  const isExist = await User.findOne({
    phoneNumber: user.phoneNumber,
    role: user.role,
  });

  if (isExist) {
    throw new ApiError(httpStatus.CONFLICT, 'User already exist!');
  } else {
    const result = await User.create(user);
    return result;
  }
};

export const AuthService = {
  createUser,
};
