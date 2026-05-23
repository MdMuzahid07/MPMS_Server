import { Router } from "express";
import multerUploadConfig from "../../config/multer.config";
import authorizationGuard from "../../middlewares/authorizationGuard";
import requestValidator from "../../middlewares/requestValidator";
import { TaskController } from "./task.controller";
import { TaskValidation } from "./task.validation";

// Global task router - mounted at /api/v1/tasks
export const globalTaskRouter = Router();
globalTaskRouter.use(authorizationGuard("ADMIN", "MANAGER", "MEMBER"));
globalTaskRouter.get("/", TaskController.getAllTasks);
globalTaskRouter.get("/:id", TaskController.getTaskById);
globalTaskRouter.delete("/:id", authorizationGuard("ADMIN", "MANAGER"), TaskController.deleteTask);
globalTaskRouter.patch(
  "/:id",
  authorizationGuard("ADMIN", "MANAGER"),
  requestValidator(TaskValidation.updateTask),
  TaskController.updateTask
);
globalTaskRouter.patch(
  "/:id/status",
  requestValidator(TaskValidation.updateStatus),
  TaskController.updateStatus
);
globalTaskRouter.patch(
  "/:id/approve",
  authorizationGuard("ADMIN", "MANAGER"),
  TaskController.approveTask
);
globalTaskRouter.patch(
  "/:id/reject",
  authorizationGuard("ADMIN", "MANAGER"),
  TaskController.rejectTask
);
globalTaskRouter.get("/:id/subtasks", TaskController.getTaskById);
globalTaskRouter.post(
  "/:id/subtasks",
  requestValidator(TaskValidation.createSubtask),
  TaskController.addSubtask
);
globalTaskRouter.patch(
  "/:id/subtasks/:subId",
  requestValidator(TaskValidation.updateSubtask),
  TaskController.updateSubtask
);
globalTaskRouter.delete("/:id/subtasks/:subId", TaskController.deleteSubtask);
globalTaskRouter.post(
  "/:id/attachments",
  multerUploadConfig.multerUpload.single("file"),
  TaskController.addAttachment
);
globalTaskRouter.delete("/:id/attachments/:attachmentId", TaskController.deleteAttachment);

// Nested sprint task router - mounted at /api/v1/projects/:projectId/sprints/:sprintId/tasks
export const sprintTaskRouter = Router({ mergeParams: true });
sprintTaskRouter.use(authorizationGuard("ADMIN", "MANAGER", "MEMBER"));
sprintTaskRouter.get("/", TaskController.getTasksBySprint);
sprintTaskRouter.post(
  "/",
  authorizationGuard("ADMIN", "MANAGER"),
  requestValidator(TaskValidation.createTask),
  TaskController.createTask
);
