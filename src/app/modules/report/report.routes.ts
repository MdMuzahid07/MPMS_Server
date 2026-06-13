import { Router } from "express";

import authorizationGuard from "../../middlewares/authorizationGuard";
import { ReportController } from "./report.controller";

const router = Router();

router.use(authorizationGuard("ADMIN", "MANAGER"));

router.get("/overview", ReportController.getOverview);
router.get("/projects", ReportController.getProjectsReport);
router.get("/users", ReportController.getUsersReport);
router.get("/sprints", ReportController.getSprintsReport);

export const ReportRoutes = router;
