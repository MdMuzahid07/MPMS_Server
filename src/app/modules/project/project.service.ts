import httpStatus from "http-status";
import { Types } from "mongoose";

import AppError from "../../errors/AppError";
import { UploadService } from "../upload/upload.service";
import type {
  ICreateProject,
  IProject,
  IProjectFilters,
  IUpdateProject,
} from "./project.interface";
import { ProjectModel } from "./project.model";

const getAllProjects = async (filters: IProjectFilters, userId: string, role: string) => {
  const query: Record<string, unknown> = {};

  // Members only see their own projects
  if (role === "MEMBER") {
    query.members = new Types.ObjectId(userId);
  }

  if (filters.status) query.status = filters.status;
  if (filters.client) query.client = { $regex: filters.client, $options: "i" };
  if (filters.search) query.$text = { $search: filters.search };

  return ProjectModel.find(query)
    .populate("members", "name email avatar role")
    .populate("createdBy", "name email")
    .lean();
};

const getProjectById = async (id: string): Promise<IProject> => {
  const project = await ProjectModel.findById(id)
    .populate("members", "name email avatar role department")
    .populate("createdBy", "name email");

  if (!project) throw new AppError(httpStatus.NOT_FOUND, "Project not found");
  return project;
};

const createProject = async (payload: ICreateProject, createdBy: string): Promise<IProject> => {
  return ProjectModel.create({
    ...payload,
    createdBy,
  });
};

const updateProject = async (id: string, payload: IUpdateProject): Promise<IProject> => {
  const project = await ProjectModel.findById(id);
  if (!project) throw new AppError(httpStatus.NOT_FOUND, "Project not found");

  const updated = await ProjectModel.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  })
    .populate("members", "name email avatar role")
    .populate("createdBy", "name email");

  if (!updated) throw new AppError(httpStatus.NOT_FOUND, "Project not found");
  return updated;
};

const deleteProject = async (id: string): Promise<void> => {
  const project = await ProjectModel.findById(id);
  if (!project) throw new AppError(httpStatus.NOT_FOUND, "Project not found");

  if (project.thumbnailPublicId) {
    await UploadService.deleteFile(project.thumbnailPublicId);
  }

  await ProjectModel.findByIdAndDelete(id);
};

const addMember = async (projectId: string, userId: string): Promise<IProject> => {
  const project = await ProjectModel.findByIdAndUpdate(
    projectId,
    { $addToSet: { members: new Types.ObjectId(userId) } },
    { new: true }
  ).populate("members", "name email avatar role");

  if (!project) throw new AppError(httpStatus.NOT_FOUND, "Project not found");
  return project;
};

const removeMember = async (projectId: string, userId: string): Promise<IProject> => {
  const project = await ProjectModel.findByIdAndUpdate(
    projectId,
    { $pull: { members: new Types.ObjectId(userId) } },
    { new: true }
  ).populate("members", "name email avatar role");

  if (!project) throw new AppError(httpStatus.NOT_FOUND, "Project not found");
  return project;
};

const getProjectStats = async (id: string) => {
  const { SprintModel } = await import("../sprint/sprint.model");
  const { TaskModel } = await import("../task/task.model");

  const sprints = await SprintModel.find({ project: id }).select("_id");
  const sprintIds = sprints.map((s) => s._id);

  const [totalTasks, completedTasks, inReview] = await Promise.all([
    TaskModel.countDocuments({ sprint: { $in: sprintIds } }),
    TaskModel.countDocuments({
      sprint: { $in: sprintIds },
      status: "DONE",
    }),
    TaskModel.countDocuments({
      sprint: { $in: sprintIds },
      status: "REVIEW",
    }),
  ]);

  const percentComplete = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return {
    totalSprints: sprints.length,
    totalTasks,
    completedTasks,
    inReview,
    remaining: totalTasks - completedTasks,
    percentComplete,
  };
};

export const ProjectService = {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
  getProjectStats,
};
