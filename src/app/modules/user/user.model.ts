import { Schema, model } from 'mongoose';
import { role } from './user.constant';
import { IUser, IUserModel } from './user.interface';

const userSchema = new Schema<IUser, IUserModel>(
  {
    password: { type: String, required: true },
    role: { type: String, enum: role },
    name: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
    },
    phoneNumber: { type: String, required: true },
    address: { type: String, required: true },
    budget: { type: Number, required: true },
    income: { type: Number, required: true },
  },
  {
    timestamps: true,
  },
);

export const User = model<IUser, IUserModel>('User', userSchema);
