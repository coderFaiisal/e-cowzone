import httpStatus from 'http-status';
import { Secret } from 'jsonwebtoken';
import config from '../../../config';
import ApiError from '../../../errors/ApiError';
import { jwtHelper } from '../../../helpers/jwtHelper';
import {
  ILogin,
  ILoginResponse,
  IRefreshTokenResponse,
} from '../../../interfaces/common';
import { IUser } from '../user/user.interface';
import { User } from '../user/user.model';

const createUser = async (user: IUser): Promise<IUser> => {
  const isExist = await User.findOne({
    phoneNumber: user.phoneNumber,
  });

  if (isExist) {
    throw new ApiError(httpStatus.CONFLICT, 'User already exist!');
  } else {
    // Set default values based on user role
    if (user.role === 'seller') {
      user.budget = 0;
    } else if (user.role === 'buyer') {
      user.income = 0;
    }

    const result = await User.create(user);
    return result;
  }
};

const loginUser = async (payload: ILogin): Promise<ILoginResponse> => {
  const { phoneNumber, password } = payload;

  //check user
  const isUserExist = await User.isUserExist(phoneNumber);

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist!');
  }

  //check password
  const isPasswordMatched = await User.isPasswordMatched(
    password,
    isUserExist.password as string,
  );

  if (!isPasswordMatched) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password is incorrect');
  }

  //create jwt token

  const { _id, role } = isUserExist;

  const accessToken = jwtHelper.createToken(
    {
      _id,
      role,
    },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string,
  );

  const refreshToken = jwtHelper.createToken(
    {
      _id,
      role,
    },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string,
  );

  return {
    accessToken,
    refreshToken,
  };
};

const refreshToken = async (
  payload: string,
): Promise<IRefreshTokenResponse> => {
  let verifiedUser = null;

  try {
    verifiedUser = jwtHelper.verifyToken(
      payload,
      config.jwt.refresh_secret as Secret,
    );
  } catch (error) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Invalid Refresh Token!');
  }

  const { _id, role } = verifiedUser;

  const isUserExist = await User.exists({ _id: _id });

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist!');
  }

  const newAccessToken = jwtHelper.createToken(
    {
      _id,
      role,
    },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string,
  );

  return {
    newAccessToken,
  };
};

export const AuthService = {
  createUser,
  loginUser,
  refreshToken,
};
