import { z } from "zod";

const createTimeLog = z.object({
  body: z.object({
    hours: z.coerce.number().min(0.1, "Minimum 0.1 hours").max(24, "Maximum 24 hours per entry"),
    description: z.string().max(500).optional(),
    loggedDate: z.coerce.date().optional(),
  }),
});

const updateTimeLog = z.object({
  body: z
    .object({
      hours: z.coerce.number().min(0.1).max(24).optional(),
      description: z.string().max(500).optional(),
      loggedDate: z.coerce.date().optional(),
    })
    .strict(),
});

export const TimeLogValidation = { createTimeLog, updateTimeLog };
