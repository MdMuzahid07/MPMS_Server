import type { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/send.response";
import { TaskService } from "./task.service";

const getAllTasks = catchAsync(async (req: Request, res: Response, _: NextFunction) => {
  const result = await TaskService.getAllTasks({
    project: req.query.project as string,
    sprint: req.query.sprint as string,
    assignee: req.query.assignee as string,
    status: req.query.status as never,
    priority: req.query.priority as never,
    search: req.query.search as string,
    page: Number(req.query.page),
    limit: Number(req.query.limit),
  });
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Tasks retrieved",
    data: result,
  });
});

const getTaskById = catchAsync(async (req: Request, res: Response, _: NextFunction) => {
  const task = await TaskService.getTaskById(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Task retrieved",
    data: task,
  });
});

const getTasksBySprint = catchAsync(async (req: Request, res: Response, _: NextFunction) => {
  const tasks = await TaskService.getTasksBySprintId(req.params.sprintId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Tasks retrieved",
    data: tasks,
  });
});

const createTask = catchAsync(async (req: Request, res: Response, _: NextFunction) => {
  const task = await TaskService.createTask(
    req.params.projectId,
    req.params.sprintId,
    req.body,
    req.user._id.toString()
  );
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Task created",
    data: task,
  });
});

const updateTask = catchAsync(async (req: Request, res: Response, _: NextFunction) => {
  const task = await TaskService.updateTask(req.params.id, req.body, req.user._id.toString());
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Task updated",
    data: task,
  });
});

const updateStatus = catchAsync(async (req: Request, res: Response, _: NextFunction) => {
  const task = await TaskService.updateStatus(
    req.params.id,
    req.body.status,
    req.user._id.toString(),
    req.user.role
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Status updated",
    data: task,
  });
});

const approveTask = catchAsync(async (req: Request, res: Response, _: NextFunction) => {
  const task = await TaskService.approveTask(req.params.id, req.user._id.toString());
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Task approved",
    data: task,
  });
});

const rejectTask = catchAsync(async (req: Request, res: Response, _: NextFunction) => {
  const task = await TaskService.rejectTask(req.params.id, req.user._id.toString());
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Task rejected",
    data: task,
  });
});

const deleteTask = catchAsync(async (req: Request, res: Response, _: NextFunction) => {
  await TaskService.deleteTask(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Task deleted",
    data: null,
  });
});

// Subtasks
const addSubtask = catchAsync(async (req: Request, res: Response, _: NextFunction) => {
  const task = await TaskService.addSubtask(req.params.id, req.body.title, req.user._id.toString());
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Subtask added",
    data: task,
  });
});

const updateSubtask = catchAsync(async (req: Request, res: Response, _: NextFunction) => {
  const task = await TaskService.updateSubtask(req.params.id, req.params.subId, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Subtask updated",
    data: task,
  });
});

const deleteSubtask = catchAsync(async (req: Request, res: Response, _: NextFunction) => {
  await TaskService.deleteSubtask(req.params.id, req.params.subId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Subtask deleted",
    data: null,
  });
});

// Attachments
const addAttachment = catchAsync(async (req: Request, res: Response, _: NextFunction) => {
  if (!req.file) throw new Error("No file uploaded");
  const task = await TaskService.addAttachment(req.params.id, req.file, req.user._id.toString());
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Attachment added",
    data: task,
  });
});

const deleteAttachment = catchAsync(async (req: Request, res: Response, _: NextFunction) => {
  await TaskService.deleteAttachment(
    req.params.id,
    req.params.attachmentId,
    req.user._id.toString()
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Attachment deleted",
    data: null,
  });
});

export const TaskController = {
  getAllTasks,
  getTaskById,
  getTasksBySprint,
  createTask,
  updateTask,
  updateStatus,
  approveTask,
  rejectTask,
  deleteTask,
  addSubtask,
  updateSubtask,
  deleteSubtask,
  addAttachment,
  deleteAttachment,
};
