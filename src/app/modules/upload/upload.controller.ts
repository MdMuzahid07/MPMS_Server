import type { Request, Response } from "express";
import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/send.response";
import { UploadService } from "./upload.service";

const uploadImage = catchAsync(async (req: Request, res: Response) => {
  if (!req.file) {
    throw new AppError(httpStatus.BAD_REQUEST, "No file provided");
  }

  const result = await UploadService.uploadSingle(req.file, {
    folder: "mpms/general",
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "File uploaded successfully",
    data: result,
  });
});

const uploadAttachment = catchAsync(async (req: Request, res: Response) => {
  if (!req.file) {
    throw new AppError(httpStatus.BAD_REQUEST, "No file provided");
  }

  const isImage = req.file.mimetype.startsWith("image/");

  const result = await UploadService.uploadSingle(req.file, {
    folder: "mpms/attachments",
    resourceType: isImage ? "image" : "raw",
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Attachment uploaded successfully",
    data: {
      ...result,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
    },
  });
});

const deleteFile = catchAsync(async (req: Request, res: Response) => {
  const { publicId } = req.params;

  if (!publicId) {
    throw new AppError(httpStatus.BAD_REQUEST, "Public ID is required");
  }

  await UploadService.deleteFile(decodeURIComponent(publicId));

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "File deleted successfully",
    data: null,
  });
});

export const UploadController = {
  uploadImage,
  uploadAttachment,
  deleteFile,
};
