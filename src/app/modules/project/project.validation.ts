import { z } from "zod";

const createProject = z.object({
  body: z.object({
    title: z.string().min(2).max(150),
    client: z.string().min(1),
    description: z.string().min(10),
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
    budget: z.coerce.number().min(0),
    status: z.enum(["planned", "active", "completed", "archived"]).default("planned"),
    members: z.array(z.string()).optional(),
    thumbnail: z.string().optional(),
    thumbnailPublicId: z.string().optional(),
  }),
});

const updateProject = z.object({
  body: z.object({
    title: z.string().min(2).max(150).optional(),
    client: z.string().optional(),
    description: z.string().min(10).optional(),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
    budget: z.coerce.number().min(0).optional(),
    status: z.enum(["planned", "active", "completed", "archived"]).optional(),
    members: z.array(z.string()).optional(),
    thumbnail: z.string().optional(),
    thumbnailPublicId: z.string().optional(),
  }),
});

export const ProjectValidation = { createProject, updateProject };
