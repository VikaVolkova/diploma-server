import { Router } from "express";
import {
  getArticles,
  getUnpublishedArticles,
  getArticleByUrl,
  toggleLike,
  toggleComment,
  getArticlesByCategoryUrl,
  createArticle,
  publishArticle,
  deleteArticle,
  updateArticle,
  getPopularArticles,
} from "./article.controller.js";
import { auth } from "../middleware/auth.js";
import { ROUTES } from "../helpers/routes.js";
import { ROLES } from "../helpers/roles.js";

export const articleRoutes = Router();

articleRoutes.get(ROUTES.BASE, getArticles);

articleRoutes.get(ROUTES.ARTICLE.GET_POPULAR_ARTICLES, getPopularArticles);

articleRoutes.get(
  ROUTES.ARTICLE.GET_UNPUBLISHED_ARTICLES,
  auth([ROLES.ADMIN, ROLES.MANAGER]),
  getUnpublishedArticles
);

articleRoutes.get(ROUTES.ARTICLE.GET_ARTICLE_BY_URL, getArticleByUrl);

articleRoutes.put(
  ROUTES.ARTICLE.TOGGLE_LIKE,
  auth([ROLES.ADMIN, ROLES.MANAGER, ROLES.USER]),
  toggleLike
);

articleRoutes.put(
  ROUTES.ARTICLE.TOGGLE_COMMENT,
  auth([ROLES.ADMIN, ROLES.MANAGER, ROLES.USER]),
  toggleComment
);

articleRoutes.get(
  ROUTES.ARTICLE.GET_ARTICLES_BY_CATEGORY_URL,
  getArticlesByCategoryUrl
);

articleRoutes.post(
  ROUTES.BASE,
  auth([ROLES.ADMIN, ROLES.MANAGER]),
  createArticle
);

articleRoutes.post(
  ROUTES.ARTICLE.PUBLISH_ARTICLE,
  auth([ROLES.ADMIN]),
  publishArticle
);

articleRoutes.put(
  ROUTES.ARTICLE.DELETE_ARTICLE,
  auth([ROLES.ADMIN, ROLES.MANAGER]),
  deleteArticle
);

articleRoutes.put(
  ROUTES.ARTICLE.UPDATE_ARTICLE,
  auth([ROLES.ADMIN, ROLES.MANAGER]),
  updateArticle
);
