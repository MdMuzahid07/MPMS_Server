import express from "express";

import { ActivityRoutes } from "../modules/activity/activity.routes";
import { AuthRoutes } from "../modules/auth/auth.routes";
import { CommentRoutes } from "../modules/comment/comment.routes";
import { ProjectRoutes } from "../modules/project/project.routes";
import { ReportRoutes } from "../modules/report/report.routes";
import { SprintRoutes } from "../modules/sprint/sprint.routes";
import { globalTaskRouter, sprintTaskRouter } from "../modules/task/task.routes";
import { TimeLogRoutes } from "../modules/timelog/timelog.routes";
import { UploadRoutes } from "../modules/upload/upload.routes";
import { UserRoutes } from "../modules/user/user.routes";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/activity",
    route: ActivityRoutes,
  },
  {
    path: "/comment",
    route: CommentRoutes,
  },
  {
    path: "/projects",
    route: ProjectRoutes,
  },
  {
    path: "/report",
    route: ReportRoutes,
  },
  {
    path: "/sprint",
    route: SprintRoutes,
  },
  {
    path: "/tasks",
    route: globalTaskRouter,
  },
  {
    path: "/sprint-task",
    route: sprintTaskRouter,
  },
  {
    path: "/timelog",
    route: TimeLogRoutes,
  },
  {
    path: "/upload",
    route: UploadRoutes,
  },
  {
    path: "/user",
    route: UserRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
