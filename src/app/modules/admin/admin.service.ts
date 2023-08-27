/* eslint-disable @typescript-eslint/no-explicit-any */
import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import { JwtPayload, Secret } from 'jsonwebtoken';
import config from '../../../config';
import ApiError from '../../../errors/ApiError';
import { jwtHelper } from '../../../helpers/jwtHelper';
import { ILogin, ILoginResponse } from '../../../interfaces/common';
import { IAdmin } from './admin.interface';
import { Admin } from './admin.model';

const createAdmin = async (payload: IAdmin): Promise<IAdmin> => {
  const result = await Admin.create(payload);
  return result;
};

const loginAdmin = async (payload: ILogin): Promise<ILoginResponse> => {
  const { phoneNumber, password } = payload;

  //check admin
  const isAdminExist = await Admin.isAdminExist(phoneNumber);

  if (!isAdminExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Admin does not exist!');
  }

  //check password
  const isPasswordMatched = await Admin.isPasswordMatched(
    password,
    isAdminExist.password as string,
  );

  if (!isPasswordMatched) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password is incorrect!');
  }

  //create jwt token
  const { _id, role } = isAdminExist;

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

const getAdminProfile = async (
  user: JwtPayload | null,
): Promise<IAdmin | null> => {
  const result = await Admin.findById(user?._id, {
    name: 1,
    phoneNumber: 1,
    address: 1,
    _id: 0,
  });
  return result;
};

const updateAdminProfile = async (
  user: JwtPayload | null,
  payload: Partial<IAdmin>,
): Promise<Partial<IAdmin> | null> => {
  const isExist = await Admin.findById(user?._id);

  if (!isExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Admin does not found!');
  }

  const { name, password, ...adminData } = payload;

  const updatedAdminData: Partial<IAdmin> = { ...adminData };

  if (name && Object.keys(name).length > 0) {
    Object.keys(name).forEach(key => {
      const nameKey = `name.${key}` as keyof IAdmin;
      (updatedAdminData as any)[nameKey] = name[key as keyof typeof name];
    });
  }

  if (password) {
    updatedAdminData.password = await bcrypt.hash(
      password,
      Number(config.bcrypt_salt_rounds),
    );
  }

  const result = await Admin.findOneAndUpdate(
    { _id: user?._id },
    updatedAdminData,
    { new: true },
  ).select({ _id: 0, name: 1, phoneNumber: 1, address: 1 });

  return result;
};

export const AdminService = {
  createAdmin,
  loginAdmin,
  getAdminProfile,
  updateAdminProfile,
};
