import express from "express";
import authorizationGuard from "../../middlewares/authorizationGuard";
import requestValidator from "../../middlewares/requestValidator";
import { AuthController } from "./auth.controller";
import { AuthValidation } from "./auth.validation";

const router = express.Router();

// Public
router.post(
  "/register",
  requestValidator(AuthValidation.registerValidationSchema),
  AuthController.registerUser
);

router.post(
  "/login",
  requestValidator(AuthValidation.loginValidationSchema),
  AuthController.loginUser
);

router.post(
  "/refresh-token",
  requestValidator(AuthValidation.refreshTokenValidationSchema),
  AuthController.refreshToken
);

// Authenticated
router.get(
  "/me",
  authorizationGuard("admin", "manager", "member"),
  AuthController.getMe
);

router.patch(
  "/change-password",
  authorizationGuard("admin", "manager", "member"),
  requestValidator(AuthValidation.changePasswordValidationSchema),
  AuthController.changePassword
);

router.post(
  "/logout",
  authorizationGuard("admin", "manager", "member"),
  AuthController.logout
);

// Admin only
router.post(
  "/invite",
  authorizationGuard("admin"),
  requestValidator(AuthValidation.registerValidationSchema),
  AuthController.registerUser
);

export const AuthRoutes = router;