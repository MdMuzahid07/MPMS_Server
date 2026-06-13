import { Router } from "express";
import httpStatus from "http-status";

import authorizationGuard from "../../middlewares/authorizationGuard";
import requestValidator from "../../middlewares/requestValidator";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/send.response";
import { CommentService } from "./comment.service";
import { CommentValidation } from "./comment.validation";

// Mounted at /api/v1/tasks/:taskId/comments
const router = Router({ mergeParams: true });
router.use(authorizationGuard("ADMIN", "MANAGER", "MEMBER"));

router.get(
  "/",
  catchAsync(async (req, res) => {
    const comments = await CommentService.getCommentsByTask(req.params.taskId);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Comments retrieved",
      data: comments,
    });
  })
);

router.post(
  "/",
  requestValidator(CommentValidation.createComment),
  catchAsync(async (req, res) => {
    const comment = await CommentService.createComment(
      req.params.taskId,
      req.body,
      req.user._id.toString()
    );
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Comment added",
      data: comment,
    });
  })
);

router.patch(
  "/:id",
  requestValidator(CommentValidation.updateComment),
  catchAsync(async (req, res) => {
    const comment = await CommentService.updateComment(
      req.params.id,
      req.body.body,
      req.user._id.toString()
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Comment updated",
      data: comment,
    });
  })
);

router.delete(
  "/:id",
  catchAsync(async (req, res) => {
    await CommentService.deleteComment(req.params.id, req.user._id.toString(), req.user.role);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Comment deleted",
      data: null,
    });
  })
);

export const CommentRoutes = router;
