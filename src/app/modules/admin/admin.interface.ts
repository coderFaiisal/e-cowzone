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
  isAdminExist(phoneNumber: string): Promise<Record<string, unknown> | null>;
  isPasswordMatched(
    givenPassword: string,
    savedPassword: string,
  ): Promise<boolean>;
} & Model<IAdmin>;
