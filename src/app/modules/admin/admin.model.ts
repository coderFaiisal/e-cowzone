import { Schema, model } from 'mongoose';
import { AdminModel, IAdmin } from './admin.interface';

const adminSchema = new Schema<IAdmin, AdminModel>({
  password: { type: String, required: true },
  role: { type: String, enum: ['admin'], required: true },
  name: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
  },
  phoneNumber: { type: String, required: true },
  address: { type: String, required: true },
});

export const Admin = model<IAdmin, AdminModel>('Admin', adminSchema);
