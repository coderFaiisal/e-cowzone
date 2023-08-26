/* eslint-disable @typescript-eslint/no-this-alias */
import bcrypt from 'bcrypt';
import { Schema, model } from 'mongoose';
import config from '../../../config';
import { AdminModel, IAdmin } from './admin.interface';

const adminSchema = new Schema<IAdmin, AdminModel>(
  {
    password: { type: String, required: true, select: 0 },
    role: { type: String, enum: ['admin'], required: true },
    name: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
    },
    phoneNumber: { type: String, required: true, unique: true },
    address: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

adminSchema.statics.isAdminExist = async function (
  phoneNumber: string,
): Promise<Pick<IAdmin, 'role' | 'password'> | null> {
  return await Admin.findOne({ phoneNumber }, { role: 1, password: 1 }).lean();
};

adminSchema.statics.isPasswordMatched = async function (
  givenPassword: string,
  savedPassword: string,
): Promise<boolean> {
  return await bcrypt.compare(givenPassword, savedPassword);
};

adminSchema.pre('save', async function (next) {
  const admin = this;
  admin.password = await bcrypt.hash(
    admin.password,
    Number(config.bcrypt_salt_rounds),
  );
  next();
});

export const Admin = model<IAdmin, AdminModel>('Admin', adminSchema);
