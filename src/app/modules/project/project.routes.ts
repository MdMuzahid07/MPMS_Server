import { Router } from "express";

import multerUploadConfig from "../../config/multer.config";
import authorizationGuard from "../../middlewares/authorizationGuard";
import requestValidator from "../../middlewares/requestValidator";
import { SprintRoutes } from "../sprint/sprint.routes";
import { ProjectController } from "./project.controller";
import { ProjectValidation } from "./project.validation";

const router = Router();

router.use(authorizationGuard("ADMIN", "MANAGER", "MEMBER"));

router.get("/", ProjectController.getAllProjects);
router.get("/:id", ProjectController.getProjectById);
router.get("/:id/stats", ProjectController.getProjectStats);
router.get("/:id/members", ProjectController.getProjectById); // members included in populate

router.post(
  "/",
  authorizationGuard("ADMIN", "MANAGER"),
  multerUploadConfig.multerUpload.single("thumbnail"),
  requestValidator(ProjectValidation.createProject),
  ProjectController.createProject
);

router.patch(
  "/:id",
  authorizationGuard("ADMIN", "MANAGER"),
  requestValidator(ProjectValidation.updateProject),
  ProjectController.updateProject
);

router.delete("/:id", authorizationGuard("ADMIN"), ProjectController.deleteProject);

router.post("/:id/members", authorizationGuard("ADMIN", "MANAGER"), ProjectController.addMember);

router.delete(
  "/:id/members/:userId",
  authorizationGuard("ADMIN", "MANAGER"),
  ProjectController.removeMember
);

router.use("/:projectId/sprints", SprintRoutes);

export const ProjectRoutes = router;
