import type { Document, Types } from "mongoose";

export type TRole = "ADMIN" | "MANAGER" | "MEMBER";
export type TUserStatus = "active" | "inactive";

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: TRole;
  department?: string;
  skills: string[];
  avatar?: string;
  avatarPublicId?: string;
  status: TUserStatus;
  isActive?: boolean;
  isDeleted?: boolean;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidate: string): Promise<boolean>;
}

export interface IUserFilters {
  role?: TRole;
  department?: string;
  status?: TUserStatus;
  search?: string;
  page?: number;
  limit?: number;
}

export interface ICreateUser {
  name: string;
  email: string;
  password: string;
  role?: TRole;
  department?: string;
  skills?: string[];
}

export interface IUpdateUser {
  name?: string;
  department?: string;
  skills?: string[];
  role?: TRole;
  status?: TUserStatus;
  avatar?: string;
  avatarPublicId?: string;
}
