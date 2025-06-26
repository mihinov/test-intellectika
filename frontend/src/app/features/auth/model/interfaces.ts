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

export interface AuthRegistationDto {
	email: string;
	password: string;
	phone: string;
	organization: string;
}

//{
//  "email": "user@gmail.com",
//  "password": "password",
//  "phone": "8 906 333 33 33",
//  "organization": "Intellectika"
//}
