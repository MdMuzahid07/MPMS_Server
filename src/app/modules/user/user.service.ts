import httpStatus from "http-status";
import type { FilterQuery } from "mongoose";
import { Types } from "mongoose";

import AppError from "../../errors/AppError";
import { TaskModel } from "../task/task.model";
import { TimeLogModel } from "../timelog/timelog.model";
import { UploadService } from "../upload/upload.service";
import type { ICreateUser, IUpdateUser, IUser, IUserFilters } from "./user.interface";
import { UserModel } from "./user.model";

const buildUserFilter = (filters: IUserFilters): FilterQuery<IUser> => {
  const query: FilterQuery<IUser> = {};

  if (filters.role && String(filters.role) !== "all") {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    query.role = { $regex: `^${String(filters.role)}$`, $options: "i" } as any;
  }
  if (filters.status && String(filters.status) !== "all") {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    query.status = { $regex: `^${String(filters.status)}$`, $options: "i" } as any;
  }
  if (filters.department) {
    query.department = { $regex: filters.department, $options: "i" };
  }
  if (filters.search) {
    query.$or = [
      { name: { $regex: filters.search, $options: "i" } },
      { email: { $regex: filters.search, $options: "i" } },
      { role: { $regex: filters.search, $options: "i" } },
      { skills: { $regex: filters.search, $options: "i" } },
    ];
  }

  return query;
};

const getAllUsers = async (filters: IUserFilters) => {
  const query = buildUserFilter(filters);

  const page = Math.max(1, Number(filters.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(filters.limit) || 20));
  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    UserModel.find(query)
      .select("-password -avatarPublicId")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    UserModel.countDocuments(query),
  ]);

  return {
    users,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getUserById = async (id: string): Promise<IUser> => {
  if (!Types.ObjectId.isValid(id)) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid user ID");
  }

  const user = await UserModel.findById(id).select("-password -avatarPublicId");
  if (!user) throw new AppError(httpStatus.NOT_FOUND, "User not found");

  return user;
};

const createUser = async (payload: ICreateUser): Promise<IUser> => {
  const exists = await UserModel.findOne({
    email: payload.email.toLowerCase(),
  }).lean();

  if (exists) {
    throw new AppError(httpStatus.CONFLICT, "A user with this email already exists");
  }

  const user = await UserModel.create(payload);

  // Return without password
  return UserModel.findById(user._id).select("-password -avatarPublicId") as Promise<IUser>;
};

const updateUser = async (
  id: string,
  payload: IUpdateUser,
  file?: Express.Multer.File
): Promise<IUser> => {
  if (!Types.ObjectId.isValid(id)) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid user ID");
  }

  const user = await UserModel.findById(id).select("+avatarPublicId");
  if (!user) throw new AppError(httpStatus.NOT_FOUND, "User not found");

  // Handle avatar replacement
  if (file) {
    if (user.avatarPublicId) {
      await UploadService.deleteFile(user.avatarPublicId);
    }

    const uploaded = await UploadService.uploadSingle(file, {
      folder: "onyx/avatars",
      transformation: [{ width: 200, height: 200, crop: "fill", gravity: "face" }],
    });

    payload.avatar = uploaded.secure_url;
    payload.avatarPublicId = uploaded.public_id;
  }

  const updated = await UserModel.findByIdAndUpdate(
    id,
    { $set: payload },
    { new: true, runValidators: true }
  ).select("-password -avatarPublicId");

  if (!updated) throw new AppError(httpStatus.NOT_FOUND, "User not found");
  return updated;
};

const deleteUser = async (id: string, requesterId: string): Promise<void> => {
  if (!Types.ObjectId.isValid(id)) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid user ID");
  }

  if (id === requesterId) {
    throw new AppError(httpStatus.BAD_REQUEST, "You cannot delete your own account");
  }

  const user = await UserModel.findById(id).select("+avatarPublicId");
  if (!user) throw new AppError(httpStatus.NOT_FOUND, "User not found");

  if (user.avatarPublicId) {
    await UploadService.deleteFile(user.avatarPublicId);
  }

  await UserModel.findByIdAndDelete(id);
};

const changePassword = async (
  userId: string,
  currentPassword: string,
  newPassword: string
): Promise<void> => {
  const user = await UserModel.findById(userId).select("+password");
  if (!user) throw new AppError(httpStatus.NOT_FOUND, "User not found");

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Current password is incorrect");
  }

  if (currentPassword === newPassword) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "New password must be different from current password"
    );
  }

  user.password = newPassword;
  await user.save(); // triggers pre-save hash
};

const getUserStats = async (id: string) => {
  if (!Types.ObjectId.isValid(id)) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid user ID");
  }

  const objectId = new Types.ObjectId(id);

  const [assigned, completed, inProgress, inReview, timeAgg] = await Promise.all([
    TaskModel.countDocuments({ assignees: objectId }),
    TaskModel.countDocuments({ assignees: objectId, status: "DONE" }),
    TaskModel.countDocuments({ assignees: objectId, status: "IN_PROGRESS" }),
    TaskModel.countDocuments({ assignees: objectId, status: "REVIEW" }),
    TimeLogModel.aggregate([
      { $match: { user: objectId } },
      { $group: { _id: null, totalHours: { $sum: "$hours" } } },
    ]),
  ]);

  return {
    assigned,
    completed,
    inProgress,
    inReview,
    todo: assigned - completed - inProgress - inReview,
    totalHoursLogged: timeAgg[0]?.totalHours ?? 0,
    completionRate: assigned > 0 ? Math.round((completed / assigned) * 100) : 0,
  };
};

const getUserTasks = async (id: string, status?: string, page = 1, limit = 20) => {
  if (!Types.ObjectId.isValid(id)) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid user ID");
  }

  const filter: FilterQuery<unknown> = {
    assignees: new Types.ObjectId(id),
  };
  if (status) filter.status = status;

  const skip = (page - 1) * limit;

  const [tasks, total] = await Promise.all([
    TaskModel.find(filter)
      .populate("sprint", "title sprintNumber")
      .populate("project", "title")
      .select("title status priority dueDate estimate taskNumber")
      .sort({ dueDate: 1, priority: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    TaskModel.countDocuments(filter),
  ]);

  return {
    tasks,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const UserService = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  changePassword,
  getUserStats,
  getUserTasks,
};
