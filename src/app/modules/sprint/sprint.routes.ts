import { Router } from "express";
import authorizationGuard from "../../middlewares/authorizationGuard";
import requestValidator from "../../middlewares/requestValidator";
import { SprintController } from "./sprint.controller";
import { SprintValidation } from "./sprint.validation";

// Mounted at /api/v1/projects/:projectId/sprints
const router = Router({ mergeParams: true });

router.use(authorizationGuard("ADMIN", "MANAGER", "MEMBER"));

router.get("/", SprintController.getSprintsByProject);
router.get("/:id", SprintController.getSprintById);
router.get("/:id/stats", SprintController.getSprintStats);

router.post(
  "/",
  authorizationGuard("ADMIN", "MANAGER"),
  requestValidator(SprintValidation.createSprint),
  SprintController.createSprint
);

router.patch(
  "/:id",
  authorizationGuard("ADMIN", "MANAGER"),
  requestValidator(SprintValidation.updateSprint),
  SprintController.updateSprint
);

router.patch(
  "/reorder/bulk",
  authorizationGuard("ADMIN", "MANAGER"),
  requestValidator(SprintValidation.reorderSprints),
  SprintController.reorderSprints
);

router.delete("/:id", authorizationGuard("ADMIN", "MANAGER"), SprintController.deleteSprint);

export const SprintRoutes = router;
