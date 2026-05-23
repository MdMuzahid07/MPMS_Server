import { Types } from "mongoose";
import { ProjectModel } from "../project/project.model";
import { SprintModel } from "../sprint/sprint.model";
import { TaskModel } from "../task/task.model";
import { TimeLogModel } from "../timelog/timelog.model";
import { UserModel } from "../user/user.model";
import type {
  IOverviewReport,
  IProjectReport,
  IReportFilters,
  ISprintReport,
  IUserReport,
} from "./report.interface";

const getOverview = async (): Promise<IOverviewReport> => {
  const [
    totalProjects,
    activeProjects,
    activeSprints,
    openTasks,
    completedTasks,
    totalUsers,
    timeAgg,
  ] = await Promise.all([
    ProjectModel.countDocuments(),
    ProjectModel.countDocuments({ status: "active" }),
    SprintModel.countDocuments({ status: "ACTIVE" }),
    TaskModel.countDocuments({ status: { $ne: "DONE" } }),
    TaskModel.countDocuments({ status: "DONE" }),
    UserModel.countDocuments({ status: "active" }),
    TimeLogModel.aggregate([{ $group: { _id: null, total: { $sum: "$hours" } } }]),
  ]);

  return {
    totalProjects,
    activeProjects,
    activeSprints,
    openTasks,
    completedTasks,
    totalUsers,
    totalHoursLogged: timeAgg[0]?.total ?? 0,
  };
};

const getProjectsReport = async (): Promise<IProjectReport[]> => {
  const projects = await ProjectModel.find().select("title client status").lean();

  const reports = await Promise.all(
    projects.map(async (project) => {
      const projectId = project._id as Types.ObjectId;

      const sprints = await SprintModel.find({ project: projectId }).select("_id").lean();

      const sprintIds = sprints.map((s) => s._id);

      const tasks = await TaskModel.find({ project: projectId }).select("_id").lean();

      const taskIds = tasks.map((t) => t._id);

      const [total, done, timeAgg] = await Promise.all([
        TaskModel.countDocuments({ sprint: { $in: sprintIds } }),
        TaskModel.countDocuments({
          sprint: { $in: sprintIds },
          status: "DONE",
        }),
        TimeLogModel.aggregate([
          { $match: { task: { $in: taskIds } } },
          { $group: { _id: null, total: { $sum: "$hours" } } },
        ]),
      ]);

      return {
        project: {
          _id: projectId.toString(),
          title: project.title,
          client: project.client,
          status: project.status,
        },
        totalSprints: sprints.length,
        totalTasks: total,
        completedTasks: done,
        remaining: total - done,
        percentComplete: total > 0 ? Math.round((done / total) * 100) : 0,
        totalHoursLogged: timeAgg[0]?.total ?? 0,
      };
    })
  );

  return reports;
};

const getUsersReport = async (): Promise<IUserReport[]> => {
  const users = await UserModel.find({ status: "active" })
    .select("name email role department avatar")
    .lean();

  const reports = await Promise.all(
    users.map(async (user) => {
      const userId = user._id as Types.ObjectId;

      const [assigned, completed, inProgress, inReview, timeAgg] = await Promise.all([
        TaskModel.countDocuments({ assignees: userId }),
        TaskModel.countDocuments({ assignees: userId, status: "DONE" }),
        TaskModel.countDocuments({
          assignees: userId,
          status: "IN_PROGRESS",
        }),
        TaskModel.countDocuments({ assignees: userId, status: "REVIEW" }),
        TimeLogModel.aggregate([
          { $match: { user: userId } },
          { $group: { _id: null, total: { $sum: "$hours" } } },
        ]),
      ]);

      return {
        user: {
          _id: userId.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          department: user.department,
          avatar: user.avatar,
        },
        assigned,
        completed,
        inProgress,
        inReview,
        totalHoursLogged: timeAgg[0]?.total ?? 0,
        completionRate: assigned > 0 ? Math.round((completed / assigned) * 100) : 0,
      };
    })
  );

  return reports;
};

const getSprintsReport = async (filters: IReportFilters = {}): Promise<ISprintReport[]> => {
  const query: Record<string, unknown> = {};

  if (filters.projectId) {
    query.project = new Types.ObjectId(filters.projectId);
  }

  const sprints = await SprintModel.find(query)
    .populate("project", "title")
    .sort({ createdAt: -1 })
    .lean<ISprintLean[]>();

  interface ISprintLean {
    _id: Types.ObjectId;
    title: string;
    sprintNumber: number;
    status: string;
    project: { title: string };
  }

  const reports: ISprintReport[] = await Promise.all(
    sprints.map(async (sprint: ISprintLean): Promise<ISprintReport> => {
      const sprintId: Types.ObjectId = sprint._id as Types.ObjectId;

      const [total, done, inProgress, review, todo] = await Promise.all<number>([
        TaskModel.countDocuments({ sprint: sprintId }),
        TaskModel.countDocuments({ sprint: sprintId, status: "DONE" }),
        TaskModel.countDocuments({
          sprint: sprintId,
          status: "IN_PROGRESS",
        }),
        TaskModel.countDocuments({ sprint: sprintId, status: "REVIEW" }),
        TaskModel.countDocuments({ sprint: sprintId, status: "TODO" }),
      ]);

      return {
        sprint: {
          _id: sprintId.toString(),
          title: sprint.title,
          sprintNumber: sprint.sprintNumber,
          status: sprint.status,
          project: sprint.project as { title: string },
        },
        total,
        done,
        inProgress,
        review,
        todo,
        velocity: done,
        percentComplete: total > 0 ? Math.round((done / total) * 100) : 0,
      };
    })
  );

  return reports;
};

export const ReportService = {
  getOverview,
  getProjectsReport,
  getUsersReport,
  getSprintsReport,
};
