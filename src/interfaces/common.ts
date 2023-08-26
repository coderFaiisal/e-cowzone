import { IGenericErrorMessages } from './error';

export type IGenericResponse<T> = {
  meta: {
    page: number;
    limit: number;
    total: number;
  };
  data: T;
};

export type IGenerericErrorResponse = {
  statusCode: number;
  message: string;
  errorMessages: IGenericErrorMessages[];
};

export type ILogin = {
  phoneNumber: string;
  password: string;
};

export type ILoginResponse = {
  accessToken: string;
  refreshToken: string;
};

export type IRefreshTokenResponse = {
  newAccessToken: string;
};
