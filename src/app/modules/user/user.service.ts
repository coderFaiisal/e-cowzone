/* eslint-disable @typescript-eslint/no-explicit-any */
import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import config from '../../../config';
import ApiError from '../../../errors/ApiError';
import { IUser } from './user.interface';
import { User } from './user.model';

const getSingleUser = async (id: string): Promise<IUser | null> => {
  const result = await User.findById(id);
  return result;
};

const getAllUsers = async (): Promise<IUser[]> => {
  const result = await User.find({});
  return result;
};

const getUserProfile = async (
  user: JwtPayload | null,
): Promise<IUser | null> => {
  const result = await User.findById(user?._id, {
    name: 1,
    phoneNumber: 1,
    address: 1,
    _id: 0,
  });
  return result;
};

const updateUserProfile = async (
  user: JwtPayload | null,
  payload: Partial<IUser>,
): Promise<Partial<IUser> | null> => {
  const isExist = await User.findById(user?._id);

  if (!isExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User does not found!');
  }

  const { name, password, ...userData } = payload;

  const updatedUserData: Partial<IUser> = { ...userData };

  if (name && Object.keys(name).length > 0) {
    Object.keys(name).forEach(key => {
      const nameKey = `name.${key}` as keyof IUser;
      (updatedUserData as any)[nameKey] = name[key as keyof typeof name];
    });
  }

  if (password) {
    updatedUserData.password = await bcrypt.hash(
      password,
      Number(config.bcrypt_salt_rounds),
    );
  }

  const result = await User.findOneAndUpdate(
    { _id: user?._id },
    updatedUserData,
    { new: true },
  ).select({ _id: 0, name: 1, phoneNumber: 1, address: 1 });

  return result;
};

const deleteUser = async (id: string): Promise<IUser | null> => {
  const isExist = await User.findById(id);

  if (!isExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User is not found!');
  }

  const result = await User.findByIdAndDelete(id);
  return result;
};

export const UserService = {
  getSingleUser,
  getAllUsers,
  getUserProfile,
  updateUserProfile,
  deleteUser,
};
