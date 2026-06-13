import { model, Schema } from "mongoose";

import type { IComment } from "./comment.interface";

const commentSchema = new Schema<IComment>(
  {
    task: { type: Schema.Types.ObjectId, ref: "Task", required: true, index: true },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    body: { type: String, required: true, trim: true, maxlength: 2000 },
    parentComment: { type: Schema.Types.ObjectId, ref: "Comment", default: null },
    isEdited: { type: Boolean, default: false },
  },
  { timestamps: true }
);

commentSchema.index({ task: 1, createdAt: 1 });

export const CommentModel = model<IComment>("Comment", commentSchema);
