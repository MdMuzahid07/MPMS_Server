import httpStatus from "http-status";
import { Types } from "mongoose";

import AppError from "../../errors/AppError";
import { ActivityLogService } from "../activity/activity.service";
import { SprintModel } from "../sprint/sprint.model";
import { TimeLogModel } from "../timelog/timelog.model";
import { UploadService } from "../upload/upload.service";
import type { ICreateTask, ITask, ITaskFilters, IUpdateTask, TTaskStatus } from "./task.interface";
import { TaskModel } from "./task.model";

const POPULATE_TASK = [
  { path: "assignees", select: "name email avatar" },
  { path: "reporter", select: "name email avatar" },
  { path: "createdBy", select: "name email" },
  { path: "sprint", select: "title sprintNumber" },
  { path: "project", select: "title" },
  { path: "attachments.uploadedBy", select: "name email" },
];

const getAllTasks = async (filters: ITaskFilters) => {
  const query: Record<string, unknown> = {};

  if (filters.project) query.project = new Types.ObjectId(filters.project);
  if (filters.sprint) query.sprint = new Types.ObjectId(filters.sprint);
  if (filters.assignee) query.assignees = new Types.ObjectId(filters.assignee);
  if (filters.status) query.status = filters.status;
  if (filters.priority) query.priority = filters.priority;
  if (filters.search) query.$text = { $search: filters.search };

  const page = Number(filters.page) || 1;
  const limit = Number(filters.limit) || 20;
  const skip = (page - 1) * limit;

  const [tasks, total] = await Promise.all([
    TaskModel.find(query)
      .populate(POPULATE_TASK)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    TaskModel.countDocuments(query),
  ]);

  return {
    tasks,
    pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
};

const getTaskById = async (taskId: string): Promise<ITask> => {
  const task = await TaskModel.findById(taskId).populate(POPULATE_TASK);
  if (!task) throw new AppError(httpStatus.NOT_FOUND, "Task not found");
  return task;
};

const getTasksBySprint = async (sprintId: string) => {
  return TaskModel.find({ sprint: new Types.ObjectId(sprintId) })
    .populate(POPULATE_TASK)
    .sort({ createdAt: -1 })
    .lean();
};

const createTask = async (
  projectId: string,
  sprintId: string,
  payload: ICreateTask,
  createdBy: string
): Promise<ITask> => {
  // Verify sprint belongs to project
  const sprint = await SprintModel.findOne({
    _id: sprintId,
    project: projectId,
  });
  if (!sprint) throw new AppError(httpStatus.NOT_FOUND, "Sprint not found");

  // Auto-increment task number per project
  const lastTask = await TaskModel.findOne({ project: projectId })
    .sort({ taskNumber: -1 })
    .select("taskNumber")
    .lean();

  const taskNumber = lastTask ? lastTask.taskNumber + 1 : 1;

  const attachments =
    payload.attachments?.map((att) => ({
      ...att,
      uploadedBy: new Types.ObjectId(createdBy),
      uploadedAt: new Date(),
    })) ?? [];

  const task = await TaskModel.create({
    ...payload,
    sprint: new Types.ObjectId(sprintId),
    project: new Types.ObjectId(projectId),
    reporter: new Types.ObjectId(createdBy),
    createdBy: new Types.ObjectId(createdBy),
    assignees: payload.assignees?.map((id) => new Types.ObjectId(id)) ?? [],
    attachments,
    taskNumber,
  });

  // Log creation activity
  await ActivityLogService.log({
    task: task._id.toString(),
    user: createdBy,
    action: "CREATED",
    detail: `Task "${task.title}" created`,
  });

  return task.populate(POPULATE_TASK);
};

const updateTask = async (taskId: string, payload: IUpdateTask, userId: string): Promise<ITask> => {
  const existing = await TaskModel.findById(taskId);
  if (!existing) throw new AppError(httpStatus.NOT_FOUND, "Task not found");

  const updatePayload: Record<string, unknown> = { ...payload };
  if (payload.assignees) {
    updatePayload.assignees = payload.assignees.map((id) => new Types.ObjectId(id));
  }
  if (payload.sprint) {
    updatePayload.sprint = new Types.ObjectId(payload.sprint);
  }

  if (payload.attachments) {
    const newPublicIds = new Set(payload.attachments.map((a) => a.publicId));
    const deletedAttachments = existing.attachments.filter((a) => !newPublicIds.has(a.publicId));
    for (const delAtt of deletedAttachments) {
      try {
        await UploadService.deleteFile(delAtt.publicId);
      } catch (err) {
        console.error("Failed to delete attachment from Cloudinary:", err);
      }
    }
    updatePayload.attachments = payload.attachments.map((att) => ({
      ...att,
      uploadedBy: new Types.ObjectId(userId),
      uploadedAt: new Date(),
    }));
  }

  const updated = await TaskModel.findByIdAndUpdate(taskId, updatePayload, {
    new: true,
    runValidators: true,
  }).populate(POPULATE_TASK);

  if (!updated) throw new AppError(httpStatus.NOT_FOUND, "Task not found");

  // Log field changes
  const changes: string[] = [];
  if (payload.status && payload.status !== existing.status) {
    changes.push(`Status changed from ${existing.status} to ${payload.status}`);
  }
  if (payload.assignees) changes.push("Assignees updated");
  if (payload.priority && payload.priority !== existing.priority) {
    changes.push(`Priority changed to ${payload.priority}`);
  }

  if (changes.length > 0) {
    await ActivityLogService.log({
      task: taskId,
      user: userId,
      action: "UPDATED",
      detail: changes.join("; "),
    });
  }

  return updated;
};

const updateStatus = async (
  taskId: string,
  status: TTaskStatus,
  userId: string,
  userRole: string
): Promise<ITask> => {
  const task = await TaskModel.findById(taskId);
  if (!task) throw new AppError(httpStatus.NOT_FOUND, "Task not found");

  // Members can only move TO Review, not past it
  if (userRole === "MEMBER" && status === "DONE") {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Members cannot mark tasks as Done. Submit for Review first."
    );
  }

  const oldStatus = task.status;
  task.status = status;
  await task.save();

  await ActivityLogService.log({
    task: taskId,
    user: userId,
    action: "STATUS_CHANGED",
    detail: `Status changed from ${oldStatus} to ${status}`,
  });

  return task.populate(POPULATE_TASK);
};

const approveTask = async (taskId: string, userId: string): Promise<ITask> => {
  const task = await TaskModel.findById(taskId);
  if (!task) throw new AppError(httpStatus.NOT_FOUND, "Task not found");

  if (task.status !== "REVIEW") {
    throw new AppError(httpStatus.BAD_REQUEST, "Task must be in Review status to approve");
  }

  task.status = "DONE";
  await task.save();

  await ActivityLogService.log({
    task: taskId,
    user: userId,
    action: "APPROVED",
    detail: "Task approved and marked as Done",
  });

  return task.populate(POPULATE_TASK);
};

const rejectTask = async (taskId: string, userId: string): Promise<ITask> => {
  const task = await TaskModel.findById(taskId);
  if (!task) throw new AppError(httpStatus.NOT_FOUND, "Task not found");

  if (task.status !== "REVIEW") {
    throw new AppError(httpStatus.BAD_REQUEST, "Task must be in Review status to reject");
  }

  task.status = "IN_PROGRESS";
  await task.save();

  await ActivityLogService.log({
    task: taskId,
    user: userId,
    action: "REJECTED",
    detail: "Task rejected and moved back to In Progress",
  });

  return task.populate(POPULATE_TASK);
};

const deleteTask = async (taskId: string): Promise<void> => {
  const task = await TaskModel.findById(taskId);
  if (!task) throw new AppError(httpStatus.NOT_FOUND, "Task not found");

  // Clean up attachments from Cloudinary
  if (task.attachments.length > 0) {
    const publicIds = task.attachments.map((a) => a.publicId);
    await UploadService.deleteMultiple(publicIds);
  }

  await TaskModel.findByIdAndDelete(taskId);
};

// Subtasks

const addSubtask = async (taskId: string, title: string, userId: string) => {
  const task = await TaskModel.findByIdAndUpdate(
    taskId,
    { $push: { subtasks: { title, completed: false } } },
    { new: true }
  ).populate(POPULATE_TASK);

  if (!task) throw new AppError(httpStatus.NOT_FOUND, "Task not found");

  await ActivityLogService.log({
    task: taskId,
    user: userId,
    action: "SUBTASK_ADDED",
    detail: `Subtask added: "${title}"`,
  });

  return task;
};

const updateSubtask = async (
  taskId: string,
  subtaskId: string,
  payload: { title?: string; completed?: boolean }
) => {
  const update: Record<string, unknown> = {};
  if (payload.title !== undefined) update["subtasks.$.title"] = payload.title;
  if (payload.completed !== undefined) update["subtasks.$.completed"] = payload.completed;

  const task = await TaskModel.findOneAndUpdate(
    { _id: taskId, "subtasks._id": subtaskId },
    { $set: update },
    { new: true }
  ).populate(POPULATE_TASK);

  if (!task) throw new AppError(httpStatus.NOT_FOUND, "Subtask not found");
  return task;
};

const deleteSubtask = async (taskId: string, subtaskId: string) => {
  const task = await TaskModel.findByIdAndUpdate(
    taskId,
    { $pull: { subtasks: { _id: new Types.ObjectId(subtaskId) } } },
    { new: true }
  );
  if (!task) throw new AppError(httpStatus.NOT_FOUND, "Task not found");
};

//   Attachments

const addAttachment = async (taskId: string, file: Express.Multer.File, userId: string) => {
  const isImage = file.mimetype.startsWith("image/");
  const uploaded = await UploadService.uploadSingle(file, {
    folder: "onyx/attachments",
    resourceType: isImage ? "image" : "raw",
  });

  const attachment = {
    url: uploaded.secure_url,
    publicId: uploaded.public_id,
    filename: file.originalname,
    resourceType: isImage ? ("image" as const) : ("raw" as const),
    uploadedBy: new Types.ObjectId(userId),
    uploadedAt: new Date(),
  };

  const task = await TaskModel.findByIdAndUpdate(
    taskId,
    { $push: { attachments: attachment } },
    { new: true }
  ).populate(POPULATE_TASK);

  if (!task) throw new AppError(httpStatus.NOT_FOUND, "Task not found");

  await ActivityLogService.log({
    task: taskId,
    user: userId,
    action: "ATTACHMENT_ADDED",
    detail: `Attachment uploaded: ${file.originalname}`,
  });

  return task;
};

const deleteAttachment = async (taskId: string, attachmentId: string, userId: string) => {
  const task = await TaskModel.findById(taskId);
  if (!task) throw new AppError(httpStatus.NOT_FOUND, "Task not found");

  const attachment = task.attachments.find((a) => a._id.toString() === attachmentId);
  if (!attachment) throw new AppError(httpStatus.NOT_FOUND, "Attachment not found");

  await UploadService.deleteFile(attachment.publicId);

  await TaskModel.findByIdAndUpdate(taskId, {
    $pull: { attachments: { _id: new Types.ObjectId(attachmentId) } },
  });

  await ActivityLogService.log({
    task: taskId,
    user: userId,
    action: "ATTACHMENT_REMOVED",
    detail: `Attachment removed: ${attachment.filename}`,
  });
};

const toggleTimer = async (
  taskId: string,
  action: "start" | "stop",
  userId: string
): Promise<ITask> => {
  const task = await TaskModel.findById(taskId);
  if (!task) throw new AppError(httpStatus.NOT_FOUND, "Task not found");

  if (action === "start") {
    if (task.isTimerStopped) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Timer has already been used and stopped for this task"
      );
    }
    if (task.isTimerRunning) throw new AppError(httpStatus.BAD_REQUEST, "Timer is already running");

    task.isTimerRunning = true;
    task.timerStartedAt = new Date();
    task.status = "IN_PROGRESS";
    await task.save();

    await ActivityLogService.log({
      task: taskId,
      user: userId,
      action: "UPDATED",
      detail: "Task timer started",
    });
  } else if (action === "stop") {
    if (!task.isTimerRunning || !task.timerStartedAt) {
      throw new AppError(httpStatus.BAD_REQUEST, "Timer is not running");
    }

    const endTime = new Date();
    const diffMs = endTime.getTime() - task.timerStartedAt.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    const loggedHours = Math.max(0.1, Number(diffHours.toFixed(2)));

    task.timeSpend += loggedHours;
    task.isTimerRunning = false;
    task.timerStartedAt = null;
    task.isTimerStopped = true;
    task.status = "DONE";
    await task.save();

    await TimeLogModel.create({
      task: taskId,
      user: userId,
      hours: loggedHours,
      description: "Auto-tracked via timer",
    });

    await ActivityLogService.log({
      task: taskId,
      user: userId,
      action: "UPDATED",
      detail: `Task timer stopped. Logged ${loggedHours} hours.`,
    });
  }

  return task.populate(POPULATE_TASK);
};

export const TaskService = {
  getAllTasks,
  getTaskById,
  getTasksBySprintId: getTasksBySprint,
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
  toggleTimer,
};
