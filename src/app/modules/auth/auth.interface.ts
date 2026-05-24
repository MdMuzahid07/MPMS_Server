export type TUserRole = "admin" | "manager" | "member";
export type TUserStatus = "active" | "inactive";

export interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: TUserRole;
  isActive: boolean;
  isDeleted: boolean;
  status: TUserStatus;
  skills: string[];
  department: string;
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
  _id: string;
  userId: string;
  email: string;
  role: TUserRole;
}
