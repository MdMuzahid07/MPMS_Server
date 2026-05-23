import type { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/send.response";
import { ReportService } from "./report.service";

const getOverview = catchAsync(async (_req: Request, res: Response) => {
  const data = await ReportService.getOverview();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Overview report retrieved successfully",
    data,
  });
});

const getProjectsReport = catchAsync(async (_req: Request, res: Response) => {
  const data = await ReportService.getProjectsReport();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Projects report retrieved successfully",
    data,
  });
});

const getUsersReport = catchAsync(async (_req: Request, res: Response) => {
  const data = await ReportService.getUsersReport();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Users report retrieved successfully",
    data,
  });
});

const getSprintsReport = catchAsync(async (req: Request, res: Response) => {
  const data = await ReportService.getSprintsReport({
    projectId: req.query.projectId as string,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Sprints report retrieved successfully",
    data,
  });
});

export const ReportController = {
  getOverview,
  getProjectsReport,
  getUsersReport,
  getSprintsReport,
};
