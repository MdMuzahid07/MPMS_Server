import type { Document, Types } from "mongoose";

export type TActivityAction =
  | "CREATED"
  | "UPDATED"
  | "STATUS_CHANGED"
  | "APPROVED"
  | "REJECTED"
  | "COMMENT_ADDED"
  | "ATTACHMENT_ADDED"
  | "ATTACHMENT_REMOVED"
  | "SUBTASK_ADDED"
  | "ASSIGNEE_CHANGED";

export interface IActivityLog extends Document {
  _id: Types.ObjectId;
  task: Types.ObjectId;
  user: Types.ObjectId;
  action: TActivityAction;
  detail: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ILogPayload {
  task: string;
  user: string;
  action: TActivityAction;
  detail: string;
}

export interface IActivityFilters {
  action?: TActivityAction;
  page?: number;
  limit?: number;
}
