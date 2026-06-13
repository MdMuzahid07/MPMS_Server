import { model, Schema } from "mongoose";

import type { IActivityLog } from "./activity.interface";

const activityLogSchema = new Schema<IActivityLog>(
  {
    task: {
      type: Schema.Types.ObjectId,
      ref: "Task",
      required: true,
      index: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    action: {
      type: String,
      enum: [
        "CREATED",
        "UPDATED",
        "STATUS_CHANGED",
        "APPROVED",
        "REJECTED",
        "COMMENT_ADDED",
        "ATTACHMENT_ADDED",
        "ATTACHMENT_REMOVED",
        "SUBTASK_ADDED",
        "ASSIGNEE_CHANGED",
      ],
      required: true,
    },
    detail: {
      type: String,
      required: true,
      trim: true,
      maxlength: [500, "Detail cannot exceed 500 characters"],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

activityLogSchema.index({ task: 1, createdAt: -1 });

export const ActivityLogModel = model<IActivityLog>("ActivityLog", activityLogSchema);
