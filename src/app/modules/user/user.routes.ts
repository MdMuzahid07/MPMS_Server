import { Router } from "express";

import multerUploadConfig from "../../config/multer.config";
import authorizationGuard from "../../middlewares/authorizationGuard";
import requestValidator from "../../middlewares/requestValidator";
import { UserController } from "./user.controller";
import { UserValidation } from "./user.validation";

const router = Router();

// All user routes require authentication
router.use(authorizationGuard("ADMIN", "MANAGER", "MEMBER"));

router.get("/", authorizationGuard("ADMIN", "MANAGER"), UserController.getAllUsers);

router.post(
  "/",
  authorizationGuard("ADMIN"),
  requestValidator(UserValidation.createUser),
  UserController.createUser
);

router.get("/:id", UserController.getUserById);

router.patch(
  "/:id",
  authorizationGuard("ADMIN", "MANAGER"),
  multerUploadConfig.multerUpload.single("avatar"),
  requestValidator(UserValidation.updateUser),
  UserController.updateUser
);

router.delete("/:id", authorizationGuard("ADMIN"), UserController.deleteUser);

router.patch(
  "/:id/password",
  authorizationGuard("ADMIN", "MANAGER", "MEMBER"), // own account only — enforced in service
  requestValidator(UserValidation.changePassword),
  UserController.changePassword
);

// router.get("/:id/stats", UserController.getUserStats);

// router.get("/:id/tasks", UserController.getUserTasks);

export const UserRoutes = router;
