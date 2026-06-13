import httpStatus from "http-status";
import { Types } from "mongoose";

import AppError from "../../errors/AppError";
import { ActivityLogService } from "../activity/activity.service";
import type { ICreateComment } from "./comment.interface";
import { CommentModel } from "./comment.model";

const POPULATE_AUTHOR = { path: "author", select: "name email avatar" };

const getCommentsByTask = async (taskId: string) => {
  // Fetch flat list sorted by date; client builds the thread tree
  return CommentModel.find({ task: new Types.ObjectId(taskId) })
    .populate(POPULATE_AUTHOR)
    .populate({ path: "parentComment", select: "_id" })
    .sort({ createdAt: 1 })
    .lean();
};

const createComment = async (taskId: string, payload: ICreateComment, authorId: string) => {
  const comment = await CommentModel.create({
    task: new Types.ObjectId(taskId),
    author: new Types.ObjectId(authorId),
    body: payload.body,
    parentComment: payload.parentComment ? new Types.ObjectId(payload.parentComment) : null,
  });

  await ActivityLogService.log({
    task: taskId,
    user: authorId,
    action: "COMMENT_ADDED",
    detail: payload.parentComment ? "Replied to a comment" : "Added a comment",
  });

  return comment.populate(POPULATE_AUTHOR);
};

const updateComment = async (commentId: string, body: string, userId: string) => {
  const comment = await CommentModel.findById(commentId);
  if (!comment) throw new AppError(httpStatus.NOT_FOUND, "Comment not found");

  if (comment.author.toString() !== userId) {
    throw new AppError(httpStatus.FORBIDDEN, "You can only edit your own comments");
  }

  comment.body = body;
  comment.isEdited = true;
  await comment.save();

  return comment.populate(POPULATE_AUTHOR);
};

const deleteComment = async (commentId: string, userId: string, userRole: string) => {
  const comment = await CommentModel.findById(commentId);
  if (!comment) throw new AppError(httpStatus.NOT_FOUND, "Comment not found");

  const isOwner = comment.author.toString() === userId;
  const isPrivileged = ["ADMIN", "MANAGER"].includes(userRole);

  if (!isOwner && !isPrivileged) {
    throw new AppError(httpStatus.FORBIDDEN, "Not authorized to delete this comment");
  }

  // Also delete all replies to this comment
  await CommentModel.deleteMany({ parentComment: comment._id });
  await CommentModel.findByIdAndDelete(commentId);
};

export const CommentService = {
  getCommentsByTask,
  createComment,
  updateComment,
  deleteComment,
};
