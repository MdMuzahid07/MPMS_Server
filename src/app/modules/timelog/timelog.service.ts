import httpStatus from "http-status";
import { Types } from "mongoose";
import AppError from "../../errors/AppError";
import type {
  ICreateTimeLog,
  ITimeLog,
  ITimeLogFilters,
  IUpdateTimeLog,
} from "./timelog.interface";
import { TimeLogModel } from "./timelog.model";

const getByTask = async (taskId: string, filters: ITimeLogFilters = {}) => {
  const page = Math.max(1, Number(filters.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(filters.limit) || 20));
  const skip = (page - 1) * limit;

  const taskObjectId = new Types.ObjectId(taskId);

  const [logs, total, totalHoursAgg] = await Promise.all([
    TimeLogModel.find({ task: taskObjectId })
      .populate("user", "name email avatar")
      .sort({ loggedDate: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    TimeLogModel.countDocuments({ task: taskObjectId }),
    TimeLogModel.aggregate([
      { $match: { task: taskObjectId } },
      { $group: { _id: null, totalHours: { $sum: "$hours" } } },
    ]),
  ]);

  return {
    logs,
    totalHours: totalHoursAgg[0]?.totalHours ?? 0,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getById = async (logId: string): Promise<ITimeLog> => {
  if (!Types.ObjectId.isValid(logId)) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid time log ID");
  }

  const log = await TimeLogModel.findById(logId).populate("user", "name email avatar");

  if (!log) throw new AppError(httpStatus.NOT_FOUND, "Time log not found");
  return log;
};

const create = async (
  taskId: string,
  userId: string,
  payload: ICreateTimeLog
): Promise<ITimeLog> => {
  if (!Types.ObjectId.isValid(taskId)) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid task ID");
  }

  const log = await TimeLogModel.create({
    task: new Types.ObjectId(taskId),
    user: new Types.ObjectId(userId),
    hours: payload.hours,
    description: payload.description,
    loggedDate: payload.loggedDate ?? new Date(),
  });

  return TimeLogModel.findById(log._id).populate("user", "name email avatar") as Promise<ITimeLog>;
};

const update = async (
  logId: string,
  userId: string,
  userRole: string,
  payload: IUpdateTimeLog
): Promise<ITimeLog> => {
  if (!Types.ObjectId.isValid(logId)) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid time log ID");
  }

  const log = await TimeLogModel.findById(logId);
  if (!log) throw new AppError(httpStatus.NOT_FOUND, "Time log not found");

  // Members can only edit their own logs
  const isOwner = log.user.toString() === userId;
  const isPrivileged = ["ADMIN", "MANAGER"].includes(userRole);

  if (!isOwner && !isPrivileged) {
    throw new AppError(httpStatus.FORBIDDEN, "You can only edit your own time logs");
  }

  const updated = await TimeLogModel.findByIdAndUpdate(
    logId,
    { $set: payload },
    { new: true, runValidators: true }
  ).populate("user", "name email avatar");

  if (!updated) throw new AppError(httpStatus.NOT_FOUND, "Time log not found");
  return updated;
};

const remove = async (logId: string, userId: string, userRole: string): Promise<void> => {
  if (!Types.ObjectId.isValid(logId)) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid time log ID");
  }

  const log = await TimeLogModel.findById(logId);
  if (!log) throw new AppError(httpStatus.NOT_FOUND, "Time log not found");

  const isOwner = log.user.toString() === userId;
  const isPrivileged = ["ADMIN", "MANAGER"].includes(userRole);

  if (!isOwner && !isPrivileged) {
    throw new AppError(httpStatus.FORBIDDEN, "You can only delete your own time logs");
  }

  await TimeLogModel.findByIdAndDelete(logId);
};

const deleteByTask = async (taskId: string): Promise<void> => {
  await TimeLogModel.deleteMany({ task: new Types.ObjectId(taskId) });
};

export const TimeLogService = {
  getByTask,
  getById,
  create,
  update,
  remove,
  deleteByTask,
};
