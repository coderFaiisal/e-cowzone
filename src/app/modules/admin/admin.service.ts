import { IAdmin } from './admin.interface';
import { Admin } from './admin.model';

const createAdmin = async (payload: IAdmin): Promise<IAdmin> => {
  const result = await Admin.create(payload);
  return result;
};

const loginAdmin = async (payload: Partial<IAdmin>) => {
  const { phoneNumber, password } = payload;
  console.log(phoneNumber, password);
};

export const AdminService = {
  createAdmin,
  loginAdmin,
};
