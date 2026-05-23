import { Types } from "mongoose";
import type { IActivityFilters, ILogPayload } from "./activity.interface";
import { ActivityLogModel } from "./activity.model";

const log = async (payload: ILogPayload) => {
  return ActivityLogModel.create({
    task: new Types.ObjectId(payload.task),
    user: new Types.ObjectId(payload.user),
    action: payload.action,
    detail: payload.detail,
  });
};

const getByTask = async (taskId: string, filters: IActivityFilters = {}) => {
  const query: Record<string, unknown> = {
    task: new Types.ObjectId(taskId),
  };

  if (filters.action) query.action = filters.action;

  const page = Math.max(1, Number(filters.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(filters.limit) || 30));
  const skip = (page - 1) * limit;

  const [logs, total] = await Promise.all([
    ActivityLogModel.find(query)
      .populate("user", "name email avatar")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    ActivityLogModel.countDocuments(query),
  ]);

  return {
    logs,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const deleteByTask = async (taskId: string): Promise<void> => {
  await ActivityLogModel.deleteMany({
    task: new Types.ObjectId(taskId),
  });
};

export const ActivityLogService = { log, getByTask, deleteByTask };
