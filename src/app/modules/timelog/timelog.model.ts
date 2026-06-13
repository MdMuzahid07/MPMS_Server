import { model, Schema } from "mongoose";

import type { ITimeLog } from "./timelog.interface";

const timeLogSchema = new Schema<ITimeLog>(
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
    hours: {
      type: Number,
      required: [true, "Hours are required"],
      min: [0.1, "Minimum 0.1 hours per entry"],
      max: [24, "Maximum 24 hours per entry"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    loggedDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

timeLogSchema.index({ task: 1, user: 1 });
timeLogSchema.index({ task: 1, loggedDate: -1 });

export const TimeLogModel = model<ITimeLog>("TimeLog", timeLogSchema);
