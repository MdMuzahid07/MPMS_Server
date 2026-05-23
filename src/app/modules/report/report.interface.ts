export interface IProjectReport {
  project: {
    _id: string;
    title: string;
    client: string;
    status: string;
  };
  totalSprints: number;
  totalTasks: number;
  completedTasks: number;
  remaining: number;
  percentComplete: number;
  totalHoursLogged: number;
}

export interface IUserReport {
  user: {
    _id: string;
    name: string;
    email: string;
    role: string;
    department?: string;
    avatar?: string;
  };
  assigned: number;
  completed: number;
  inProgress: number;
  inReview: number;
  totalHoursLogged: number;
  completionRate: number;
}

export interface ISprintReport {
  sprint: {
    _id: string;
    title: string;
    sprintNumber: number;
    status: string;
    project: { title: string };
  };
  total: number;
  done: number;
  inProgress: number;
  review: number;
  todo: number;
  velocity: number;
  percentComplete: number;
}

export interface IOverviewReport {
  totalProjects: number;
  activeProjects: number;
  activeSprints: number;
  openTasks: number;
  completedTasks: number;
  totalUsers: number;
  totalHoursLogged: number;
}

export interface IReportFilters {
  projectId?: string;
}
