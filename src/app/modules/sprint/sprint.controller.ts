import type { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/send.response";
import { SprintService } from "./sprint.service";

const getSprintsByProject = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
  const sprints = await SprintService.getSprintsByProject(req.params.projectId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Sprints retrieved successfully",
    data: sprints,
  });
});

const getSprintById = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
  const sprint = await SprintService.getSprintById(req.params.projectId, req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Sprint retrieved successfully",
    data: sprint,
  });
});

const createSprint = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
  const sprint = await SprintService.createSprint(
    req.params.projectId,
    req.body,
    req.user._id.toString()
  );
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Sprint created successfully",
    data: sprint,
  });
});

const updateSprint = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
  const sprint = await SprintService.updateSprint(req.params.projectId, req.params.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Sprint updated successfully",
    data: sprint,
  });
});

const deleteSprint = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
  await SprintService.deleteSprint(req.params.projectId, req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Sprint deleted successfully",
    data: null,
  });
});

const reorderSprints = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
  await SprintService.reorderSprints(req.params.projectId, req.body.orderedIds);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Sprints reordered successfully",
    data: null,
  });
});

const getSprintStats = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
  const stats = await SprintService.getSprintStats(req.params.projectId, req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Sprint stats retrieved",
    data: stats,
  });
});

export const SprintController = {
  getSprintsByProject,
  getSprintById,
  createSprint,
  updateSprint,
  deleteSprint,
  reorderSprints,
  getSprintStats,
};
