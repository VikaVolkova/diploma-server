import { Router } from "express";
import {
  getCommentsByArticleId,
  createComment,
  getUnpublishedComments,
} from "./comment.controller.js";
import { auth } from "../middleware/auth.js";
import { ROUTES } from "../helpers/routes.js";

export const commentRoutes = Router();

commentRoutes.get(
  ROUTES.COMMENT.GET_COMMENTS_BY_ARTICLE_ID,
  getCommentsByArticleId
);

commentRoutes.post(ROUTES.BASE, auth, createComment);

commentRoutes.get(
  ROUTES.COMMENT.GET_UNPUBLISHED_COMMENTS,
  auth,
  getUnpublishedComments
);
