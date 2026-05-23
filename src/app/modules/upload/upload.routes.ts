import { Router } from "express";
import multerUploadConfig from "../../config/multer.config";
import authorizationGuard from "../../middlewares/authorizationGuard";
import { UploadController } from "./upload.controller";

const router = Router();

router.post(
  "/image",
  authorizationGuard("ADMIN", "MANAGER"),
  multerUploadConfig.multerUpload.single("file"),
  UploadController.uploadImage
);

router.post(
  "/attachment",
  authorizationGuard("ADMIN", "MANAGER", "MEMBER"),
  multerUploadConfig.multerUpload.single("file"),
  UploadController.uploadAttachment
);

// Delete by public-id (URL-encoded)
router.delete("/:publicId(*)", authorizationGuard("ADMIN"), UploadController.deleteFile);

export const UploadRoutes = router;
