import httpStatus from "http-status";
import { Types } from "mongoose";

import AppError from "../../errors/AppError";
import { ProjectModel } from "../project/project.model";
import type { ICreateSprint, ISprint, IUpdateSprint } from "./sprint.interface";
import { SprintModel } from "./sprint.model";

const getSprintsByProject = async (projectId: string) => {
  return SprintModel.find({ project: new Types.ObjectId(projectId) })
    .sort({ order: 1, sprintNumber: 1 })
    .populate("createdBy", "name email avatar")
    .lean();
};

const getSprintById = async (projectId: string, sprintId: string): Promise<ISprint> => {
  const sprint = await SprintModel.findOne({
    _id: sprintId,
    project: projectId,
  }).populate("createdBy", "name email avatar");

  if (!sprint) throw new AppError(httpStatus.NOT_FOUND, "Sprint not found");
  return sprint;
};

const createSprint = async (
  projectId: string,
  payload: ICreateSprint,
  createdBy: string
): Promise<ISprint> => {
  // Verify project exists
  const project = await ProjectModel.findById(projectId);
  if (!project) throw new AppError(httpStatus.NOT_FOUND, "Project not found");

  // Auto-increment sprint number per project
  const lastSprint = await SprintModel.findOne({ project: projectId })
    .sort({ sprintNumber: -1 })
    .select("sprintNumber")
    .lean();

  const sprintNumber = lastSprint ? lastSprint.sprintNumber + 1 : 1;

  // Set order = sprintNumber for default ordering
  const sprint = await SprintModel.create({
    ...payload,
    project: new Types.ObjectId(projectId),
    sprintNumber,
    order: sprintNumber,
    createdBy: new Types.ObjectId(createdBy),
  });

  return sprint;
};

const updateSprint = async (
  projectId: string,
  sprintId: string,
  payload: IUpdateSprint
): Promise<ISprint> => {
  const sprint = await SprintModel.findOneAndUpdate(
    { _id: sprintId, project: projectId },
    payload,
    { new: true, runValidators: true }
  ).populate("createdBy", "name email avatar");

  if (!sprint) throw new AppError(httpStatus.NOT_FOUND, "Sprint not found");
  return sprint;
};

const deleteSprint = async (projectId: string, sprintId: string): Promise<void> => {
  // Check for tasks in this sprint before deleting
  const { TaskModel } = await import("../task/task.model");
  const taskCount = await TaskModel.countDocuments({ sprint: sprintId });
  if (taskCount > 0) {
    throw new AppError(
      httpStatus.CONFLICT,
      `Cannot delete sprint with ${taskCount} task(s). Reassign or delete tasks first.`
    );
  }

  const deleted = await SprintModel.findOneAndDelete({
    _id: sprintId,
    project: projectId,
  });
  if (!deleted) throw new AppError(httpStatus.NOT_FOUND, "Sprint not found");
};

const reorderSprints = async (projectId: string, orderedIds: string[]): Promise<void> => {
  const bulkOps = orderedIds.map((id, index) => ({
    updateOne: {
      filter: { _id: new Types.ObjectId(id), project: new Types.ObjectId(projectId) },
      update: { $set: { order: index + 1 } },
    },
  }));

  await SprintModel.bulkWrite(bulkOps);
};

const getSprintStats = async (projectId: string, sprintId: string) => {
  const { TaskModel } = await import("../task/task.model");

  const [total, done, inProgress, review, todo] = await Promise.all([
    TaskModel.countDocuments({ sprint: sprintId }),
    TaskModel.countDocuments({ sprint: sprintId, status: "DONE" }),
    TaskModel.countDocuments({ sprint: sprintId, status: "IN_PROGRESS" }),
    TaskModel.countDocuments({ sprint: sprintId, status: "REVIEW" }),
    TaskModel.countDocuments({ sprint: sprintId, status: "TODO" }),
  ]);

  const percentComplete = total > 0 ? Math.round((done / total) * 100) : 0;

  return { total, done, inProgress, review, todo, percentComplete };
};

export const SprintService = {
  getSprintsByProject,
  getSprintById,
  createSprint,
  updateSprint,
  reorderSprints,
  deleteSprint,
  getSprintStats,
};
