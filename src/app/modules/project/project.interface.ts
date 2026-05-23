import type { Document, Types } from "mongoose";

export type TProjectStatus = "planned" | "active" | "completed" | "archived";

export interface IProject extends Document {
  _id: Types.ObjectId;
  title: string;
  client: string;
  description: string;
  startDate: Date;
  endDate: Date;
  budget: number;
  status: TProjectStatus;
  thumbnail?: string;
  thumbnailPublicId?: string;
  members: Types.ObjectId[];
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface IProjectFilters {
  status?: TProjectStatus;
  client?: string;
  search?: string;
}

export interface ICreateProject {
  title: string;
  client: string;
  description: string;
  startDate: Date;
  endDate: Date;
  budget: number;
  status?: TProjectStatus;
  members?: string[];
}

export interface IUpdateProject extends Partial<ICreateProject> {
  thumbnail?: string;
  thumbnailPublicId?: string;
}
