import { z } from "zod";

const createTask = z.object({
  body: z.object({
    title: z.string().min(2).max(200),
    description: z.string().optional(),
    assignees: z.array(z.string()).optional(),
    estimate: z.coerce.number().min(0).optional(),
    priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).default("MEDIUM"),
    status: z.enum(["TODO", "IN_PROGRESS", "REVIEW", "DONE"]).default("TODO"),
    dueDate: z.coerce.date().optional(),
  }),
});

const updateTask = z.object({
  body: z.object({
    title: z.string().min(2).max(200).optional(),
    description: z.string().optional(),
    assignees: z.array(z.string()).optional(),
    estimate: z.coerce.number().min(0).optional(),
    priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).optional(),
    status: z.enum(["TODO", "IN_PROGRESS", "REVIEW", "DONE"]).optional(),
    dueDate: z.coerce.date().optional(),
    sprint: z.string().optional(),
  }),
});

const updateStatus = z.object({
  body: z.object({
    status: z.enum(["TODO", "IN_PROGRESS", "REVIEW", "DONE"]),
  }),
});

const createSubtask = z.object({
  body: z.object({
    title: z.string().min(1).max(200),
  }),
});

const updateSubtask = z.object({
  body: z.object({
    title: z.string().min(1).max(200).optional(),
    completed: z.boolean().optional(),
  }),
});

export const TaskValidation = {
  createTask,
  updateTask,
  updateStatus,
  createSubtask,
  updateSubtask,
};
