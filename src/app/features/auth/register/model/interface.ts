export interface IRegisterRequest {
  username: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  password: string;
}

export interface IRegisterResponse {
  id?: number;
  username?: string;
  email?: string;
  fullName?: string;
  phoneNumber?: string;
  status?: string;
  message?: string;
  token?: string;
}

export interface IRegisterError {
  field?: string;
  message?: string;
  code?: string;
}

