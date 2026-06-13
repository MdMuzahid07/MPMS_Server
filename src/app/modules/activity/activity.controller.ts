import type { Request, Response } from "express";
import httpStatus from "http-status";

import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/send.response";
import { ActivityLogService } from "./activity.service";

const getActivityByTask = catchAsync(async (req: Request, res: Response) => {
  const result = await ActivityLogService.getByTask(req.params.taskId, {
    action: req.query.action as never,
    page: Number(req.query.page),
    limit: Number(req.query.limit),
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Activity logs retrieved successfully",
    data: result,
  });
});

export const ActivityController = { getActivityByTask };
