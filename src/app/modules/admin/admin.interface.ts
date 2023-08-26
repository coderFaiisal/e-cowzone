/* eslint-disable no-unused-vars */
import { Model } from 'mongoose';

export type ILoginAdmin = {
  phoneNumber: string;
  password: string;
};

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
  isAdminExist(id: string): Promise<Pick<IAdmin, 'role' | 'password'> | null>;
  isPasswordMatched(
    givenPassword: string,
    savedPassword: string,
  ): Promise<boolean>;
} & Model<IAdmin>;
