import { z } from "zod";

const createComment = z.object({
  body: z.object({
    body: z.string().min(1).max(2000),
    parentComment: z.string().optional(),
  }),
});

const updateComment = z.object({
  body: z.object({
    body: z.string().min(1).max(2000),
  }),
});

export const CommentValidation = { createComment, updateComment };
