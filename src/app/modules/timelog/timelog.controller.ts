import type { Request, Response } from "express";
import httpStatus from "http-status";

import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/send.response";
import { TimeLogService } from "./timelog.service";

const getByTask = catchAsync(async (req: Request, res: Response) => {
  const result = await TimeLogService.getByTask(req.params.taskId, {
    page: Number(req.query.page),
    limit: Number(req.query.limit),
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Time logs retrieved successfully",
    data: result,
  });
});

const getById = catchAsync(async (req: Request, res: Response) => {
  const log = await TimeLogService.getById(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Time log retrieved successfully",
    data: log,
  });
});

const create = catchAsync(async (req: Request, res: Response) => {
  const log = await TimeLogService.create(req.params.taskId, req.user._id.toString(), req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Time logged successfully",
    data: log,
  });
});

const update = catchAsync(async (req: Request, res: Response) => {
  const log = await TimeLogService.update(
    req.params.id,
    req.user._id.toString(),
    req.user.role,
    req.body
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Time log updated successfully",
    data: log,
  });
});

const remove = catchAsync(async (req: Request, res: Response) => {
  await TimeLogService.remove(req.params.id, req.user._id.toString(), req.user.role);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Time log deleted successfully",
    data: null,
  });
});

export const TimeLogController = { getByTask, getById, create, update, remove };
