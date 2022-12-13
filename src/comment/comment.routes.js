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

export const commentRoutes = Router();

commentRoutes.get(
  ROUTES.COMMENT.GET_COMMENTS_BY_ARTICLE_ID,
  getCommentsByArticleId
);

commentRoutes.post(ROUTES.BASE, auth, createComment);
commentRoutes.post(ROUTES.COMMENT.PUBLISH_COMMENT, auth, publishComment);
commentRoutes.delete(ROUTES.COMMENT.DELETE_COMMENT, auth, deleteComment);

commentRoutes.get(
  ROUTES.COMMENT.GET_UNPUBLISHED_COMMENTS,
  auth,
  getUnpublishedComments
);
