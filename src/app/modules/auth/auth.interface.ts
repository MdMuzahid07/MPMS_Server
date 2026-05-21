export type TUserRole = "admin" | "manager" | "member";

export interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: TUserRole;
  isActive: boolean;
  isDeleted: boolean;
}

export interface ILoginPayload {
  email: string;
  password: string;
}

export interface IRegisterPayload {
  name: string;
  email: string;
  password: string;
  role?: TUserRole;
}

export interface ITokenPayload {
  userId: string;
  email: string;
  role: TUserRole;
}