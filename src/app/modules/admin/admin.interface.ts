/* eslint-disable no-unused-vars */
import { Model } from 'mongoose';

export type IAdmin = {
  password: string;
  role: 'admin';
  name: {
    firstName: string;
    lastName: string;
  };
  phoneNumber: string;
  address: string;
};

export type AdminModel = {
  isAdminExist(id: string): Promise<Pick<IAdmin, 'role'> | null>;
  isPasswordMatched(
    givenPassword: string,
    savedPassword: string,
  ): Promise<boolean>;
} & Model<IAdmin>;
