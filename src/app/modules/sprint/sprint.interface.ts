import type { Document, Types } from "mongoose";

export type TSprintStatus = "PLANNING" | "ACTIVE" | "COMPLETED";

export interface ISprint extends Document {
  _id: Types.ObjectId;
  project: Types.ObjectId;
  title: string;
  sprintNumber: number;
  startDate: Date;
  endDate: Date;
  status: TSprintStatus;
  order: number;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateSprint {
  title: string;
  startDate: Date;
  endDate: Date;
  status?: TSprintStatus;
}

export interface IUpdateSprint extends Partial<ICreateSprint> {
  order?: number;
}
