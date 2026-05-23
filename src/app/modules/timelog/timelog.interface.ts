import type { Document, Types } from "mongoose";

export interface ITimeLog extends Document {
  _id: Types.ObjectId;
  task: Types.ObjectId;
  user: Types.ObjectId;
  hours: number;
  description?: string;
  loggedDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateTimeLog {
  hours: number;
  description?: string;
  loggedDate?: Date;
}

export interface IUpdateTimeLog {
  hours?: number;
  description?: string;
  loggedDate?: Date;
}

export interface ITimeLogFilters {
  page?: number;
  limit?: number;
}
