import { Router } from "express";

import authorizationGuard from "../../middlewares/authorizationGuard";
import requestValidator from "../../middlewares/requestValidator";
import { TimeLogController } from "./timelog.controller";
import { TimeLogValidation } from "./timelog.validation";

// Mounted at /api/v1/tasks/:taskId/timelogs
const router = Router({ mergeParams: true });

router.use(authorizationGuard("ADMIN", "MANAGER", "MEMBER"));

router.get("/", TimeLogController.getByTask);

router.post("/", requestValidator(TimeLogValidation.createTimeLog), TimeLogController.create);

router.get("/:id", TimeLogController.getById);

router.patch("/:id", requestValidator(TimeLogValidation.updateTimeLog), TimeLogController.update);

router.delete("/:id", TimeLogController.remove);

export const TimeLogRoutes = router;
