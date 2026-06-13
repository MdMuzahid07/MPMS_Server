import { model, Schema } from "mongoose";

import type { ISprint } from "./sprint.interface";

const sprintSchema = new Schema<ISprint>(
  {
    project: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, "Sprint title is required"],
      trim: true,
      maxlength: [150, "Title cannot exceed 150 characters"],
    },
    sprintNumber: {
      type: Number,
      required: true,
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ["PLANNING", "ACTIVE", "COMPLETED"],
      default: "PLANNING",
    },
    order: { type: Number, default: 0 },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Enforce unique sprint number per project
sprintSchema.index({ project: 1, sprintNumber: 1 }, { unique: true });
sprintSchema.index({ project: 1, order: 1 });

export const SprintModel = model<ISprint>("Sprint", sprintSchema);
