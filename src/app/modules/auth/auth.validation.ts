import { z } from "zod";

const passwordSchema = z
  .string({ message: "Password is required" })
  .min(8, "Password must be at least 8 characters")
  .max(32, "Password must not exceed 32 characters")
  .regex(/[A-Z]/, "Must contain at least one uppercase letter")
  .regex(/[a-z]/, "Must contain at least one lowercase letter")
  .regex(/[0-9]/, "Must contain at least one number")
  .regex(/[^A-Za-z0-9]/, "Must contain at least one special character");

const registerValidationSchema = z.object({
  body: z.object({
    name: z
      .string({ message: "Name is required" })
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name must not exceed 50 characters")
      .trim(),
    email: z
      .string({ message: "Email is required" })
      .email("Invalid email address")
      .toLowerCase(),
    password: passwordSchema,
    role: z.enum(["admin", "manager", "member"] , {
      message: "Role must be admin, manager, or member",
    })
      .optional()
      .default("member"),
  }),
});

const loginValidationSchema = z.object({
  body: z.object({
    email: z
      .string({ message: "Email is required" })
      .email("Invalid email address")
      .toLowerCase(),
    password: z.string({ message: "Password is required" }).min(1),
  }),
});

const refreshTokenValidationSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({
      message: "Refresh token is required",
    }),
  }),
});

const changePasswordValidationSchema = z.object({
  body: z.object({
    oldPassword: z
      .string({ message: "Old password is required" })
      .min(1),
    newPassword: passwordSchema,
  }),
});

export const AuthValidation = {
  registerValidationSchema,
  loginValidationSchema,
  refreshTokenValidationSchema,
  changePasswordValidationSchema,
};