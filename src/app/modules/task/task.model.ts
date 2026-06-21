import { model, Schema } from "mongoose";

import type { ITask } from "./task.interface";

const subtaskSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    completed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const attachmentSchema = new Schema({
  url: { type: String, required: true },
  publicId: { type: String, required: true },
  filename: { type: String, required: true },
  resourceType: { type: String, enum: ["image", "raw"], default: "image" },
  uploadedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  uploadedAt: { type: Date, default: Date.now },
});

const taskSchema = new Schema<ITask>(
  {
    title: {
      type: String,
      required: [true, "Task title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    description: { type: String },
    sprint: {
      type: Schema.Types.ObjectId,
      ref: "Sprint",
      required: true,
      index: true,
    },
    project: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },
    assignees: [{ type: Schema.Types.ObjectId, ref: "User" }],
    reporter: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    priority: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
      default: "MEDIUM",
    },
    status: {
      type: String,
      enum: ["TODO", "IN_PROGRESS", "REVIEW", "DONE"],
      default: "TODO",
    },
    estimate: { type: Number, min: 0 },
    timeSpend: {
      type: Number,
      default: 0,
    },
    dueDate: { type: Date },
    subtasks: [subtaskSchema],
    attachments: [attachmentSchema],
    taskNumber: { type: Number, required: true },
    isTimerRunning: { type: Boolean, default: false },
    timerStartedAt: { type: Date, default: null },
    isTimerStopped: { type: Boolean, default: false },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Compound indexes for frequent query patterns
taskSchema.index({ project: 1, status: 1 });
taskSchema.index({ project: 1, taskNumber: 1 }, { unique: true });
taskSchema.index({ assignees: 1, status: 1 });
taskSchema.index({ sprint: 1, status: 1 });
taskSchema.index({ title: "text", description: "text" });

export const TaskModel = model<ITask>("Task", taskSchema);
