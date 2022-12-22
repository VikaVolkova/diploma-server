import { Router } from "express";
import {
  getCommentsByArticleId,
  createComment,
  getUnpublishedComments,
  publishComment,
  deleteComment,
} from "./comment.controller.js";
import { auth } from "../middleware/auth.js";
import { ROUTES } from "../helpers/routes.js";
import { ROLES } from "../helpers/roles.js";

export const commentRoutes = Router();

commentRoutes.get(
  ROUTES.COMMENT.GET_COMMENTS_BY_ARTICLE_ID,
  getCommentsByArticleId
);

commentRoutes.post(
  ROUTES.BASE,
  auth([ROLES.ADMIN, ROLES.MANAGER, ROLES.USER]),
  createComment
);
commentRoutes.post(
  ROUTES.COMMENT.PUBLISH_COMMENT,
  auth([ROLES.ADMIN, ROLES.MANAGER]),
  publishComment
);
commentRoutes.delete(
  ROUTES.COMMENT.DELETE_COMMENT,
  auth([ROLES.ADMIN, ROLES.MANAGER]),
  deleteComment
);

commentRoutes.get(
  ROUTES.COMMENT.GET_UNPUBLISHED_COMMENTS,
  auth([ROLES.ADMIN, ROLES.MANAGER]),
  getUnpublishedComments
);
