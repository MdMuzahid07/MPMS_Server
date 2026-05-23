import type { Document, Types } from "mongoose";

export interface IComment extends Document {
  _id: Types.ObjectId;
  task: Types.ObjectId;
  author: Types.ObjectId;
  body: string;
  parentComment?: Types.ObjectId; // for threading
  isEdited: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateComment {
  body: string;
  parentComment?: string;
}
