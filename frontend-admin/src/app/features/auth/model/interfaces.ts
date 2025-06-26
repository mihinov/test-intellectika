export interface AuthLogin {
  email: string;
  password: string;
}

export enum UserRole {
  Admin = 'admin',
  User = 'user',
};

export interface User {
  email: string;
  organization: string;
  phone: string;
  role: UserRole;
}

export interface AuthLoginResponse {
  access_token: string;
}
