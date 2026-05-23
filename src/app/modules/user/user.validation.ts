import { z } from "zod";

const createUser = z.object({
  body: z.object({
    name: z.string().min(2).max(100),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters").max(64),
    role: z.enum(["ADMIN", "MANAGER", "MEMBER"]).default("MEMBER"),
    department: z.string().max(100).optional(),
    skills: z.array(z.string().min(1)).max(20).optional(),
  }),
});

const updateUser = z.object({
  body: z
    .object({
      name: z.string().min(2).max(100).optional(),
      department: z.string().max(100).optional(),
      skills: z.array(z.string().min(1)).max(20).optional(),
      role: z.enum(["ADMIN", "MANAGER", "MEMBER"]).optional(),
      status: z.enum(["active", "inactive"]).optional(),
    })
    .strict(),
});

const changePassword = z.object({
  body: z.object({
    currentPassword: z.string().min(6),
    newPassword: z.string().min(6, "New password must be at least 6 characters").max(64),
  }),
});

export const UserValidation = { createUser, updateUser, changePassword };
