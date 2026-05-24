import type { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";

import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/send.response";
import { ProjectService } from "./project.service";

const getAllProjects = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
  const filters = {
    status: req.query.status as never,
    client: req.query.client as string,
    search: req.query.search as string,
  };
  const projects = await ProjectService.getAllProjects(
    filters,
    req.user._id.toString(),
    req.user.role
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Projects retrieved successfully",
    data: projects,
  });
});

const getProjectById = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
  const project = await ProjectService.getProjectById(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Project retrieved successfully",
    data: project,
  });
});

const createProject = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
  const project = await ProjectService.createProject(req.body, req.user._id.toString());
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Project created successfully",
    data: project,
  });
});

const updateProject = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
  const project = await ProjectService.updateProject(req.params.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Project updated successfully",
    data: project,
  });
});

const deleteProject = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
  await ProjectService.deleteProject(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Project deleted successfully",
    data: null,
  });
});

const addMember = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
  const project = await ProjectService.addMember(req.params.id, req.body.userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Member added to project",
    data: project,
  });
});

const removeMember = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
  const project = await ProjectService.removeMember(req.params.id, req.params.userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Member removed from project",
    data: project,
  });
});

const getProjectStats = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
  const stats = await ProjectService.getProjectStats(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Project stats retrieved",
    data: stats,
  });
});

export const ProjectController = {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
  getProjectStats,
};
