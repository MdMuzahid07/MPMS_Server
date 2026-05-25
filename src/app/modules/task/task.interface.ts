import type { Document, Types } from "mongoose";

export type TTaskStatus = "TODO" | "IN_PROGRESS" | "REVIEW" | "DONE";
export type TTaskPriority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export interface ISubtask {
  _id: Types.ObjectId;
  title: string;
  completed: boolean;
  createdAt: Date;
}

export interface IAttachment {
  _id: Types.ObjectId;
  url: string;
  publicId: string;
  filename: string;
  resourceType: "image" | "raw";
  uploadedBy: Types.ObjectId;
  uploadedAt: Date;
}

export interface ITask extends Document {
  _id: Types.ObjectId;
  title: string;
  description?: string;
  sprint: Types.ObjectId;
  project: Types.ObjectId;
  assignees: Types.ObjectId[];
  reporter: Types.ObjectId;
  priority: TTaskPriority;
  status: TTaskStatus;
  estimate?: number; // hours
  dueDate?: Date;
  subtasks: ISubtask[];
  attachments: IAttachment[];
  taskNumber: number; // auto-increment per project
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITaskFilters {
  project?: string;
  sprint?: string;
  assignee?: string;
  status?: TTaskStatus;
  priority?: TTaskPriority;
  search?: string;
  page?: number;
  limit?: number;
}

export interface ICreateAttachmentInput {
  url: string;
  publicId: string;
  filename: string;
  resourceType?: "image" | "raw";
}

export interface ICreateTask {
  title: string;
  description?: string;
  assignees?: string[];
  estimate?: number;
  priority?: TTaskPriority;
  status?: TTaskStatus;
  dueDate?: Date;
  attachments?: ICreateAttachmentInput[];
  subtasks?: { title: string; completed?: boolean }[];
}

export interface IUpdateTask extends Partial<ICreateTask> {
  sprint?: string;
}
