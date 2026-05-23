import { Schema, model } from "mongoose";
import type { IProject } from "./project.interface";

const projectSchema = new Schema<IProject>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [150, "Title cannot exceed 150 characters"],
    },
    client: {
      type: String,
      required: [true, "Client is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    startDate: {
      type: Date,
      required: [true, "Start date is required"],
    },
    endDate: {
      type: Date,
      required: [true, "End date is required"],
    },
    budget: {
      type: Number,
      required: [true, "Budget is required"],
      min: [0, "Budget cannot be negative"],
    },
    status: {
      type: String,
      enum: ["planned", "active", "completed", "archived"],
      default: "planned",
    },
    thumbnail: { type: String },
    thumbnailPublicId: { type: String },
    members: [{ type: Schema.Types.ObjectId, ref: "User" }],
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Text index for search
projectSchema.index({ title: "text", client: "text", description: "text" });

export const ProjectModel = model<IProject>("Project", projectSchema);
