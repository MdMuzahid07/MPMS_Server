import { z } from "zod";

const createSprint = z.object({
  body: z
    .object({
      title: z.string().min(2).max(150),
      startDate: z.coerce.date(),
      endDate: z.coerce.date(),
      status: z.enum(["PLANNING", "ACTIVE", "COMPLETED"]).default("PLANNING"),
    })
    .refine((d) => d.endDate > d.startDate, {
      message: "End date must be after start date",
      path: ["endDate"],
    }),
});

const updateSprint = z.object({
  body: z.object({
    title: z.string().min(2).max(150).optional(),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
    status: z.enum(["PLANNING", "ACTIVE", "COMPLETED"]).optional(),
    order: z.number().int().min(0).optional(),
  }),
});

const reorderSprints = z.object({
  body: z.object({
    orderedIds: z.array(z.string()).min(1),
  }),
});

export const SprintValidation = { createSprint, updateSprint, reorderSprints };
