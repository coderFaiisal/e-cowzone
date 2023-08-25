import { Schema, model } from 'mongoose';
import { AdminModel, IAdmin } from './admin.interface';

const adminSchema = new Schema<IAdmin, AdminModel>(
  {
    password: { type: String, required: true },
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
  id: string,
): Promise<Pick<IAdmin, 'role'> | null> {
  return await Admin.findById(id, { role: 1 }).lean();
};

export const Admin = model<IAdmin, AdminModel>('Admin', adminSchema);
