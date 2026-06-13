import { Router } from "express";

import authorizationGuard from "../../middlewares/authorizationGuard";
import { ActivityController } from "./activity.controller";

// Mounted at /api/v1/tasks/:taskId/activity
const router = Router({ mergeParams: true });

router.use(authorizationGuard("ADMIN", "MANAGER", "MEMBER"));

router.get("/", ActivityController.getActivityByTask);

export const ActivityRoutes = router;
