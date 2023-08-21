import { IUser } from '../user/user.interface';
import { User } from '../user/user.model';

const createUser = async (user: IUser): Promise<IUser> => {
  const result = await User.create(user);
  return result;
};

export const AuthService = {
  createUser,
};
