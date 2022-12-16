import { Router } from "express";
import {
  getArticles,
  getUnpublishedArticles,
  getArticleByUrl,
  getArticlesByCategoryUrl,
  createArticle,
  publishArticle,
  deleteArticle,
} from "./article.controller.js";
import { auth } from "../middleware/auth.js";
import { ROUTES } from "../helpers/routes.js";
import { ROLES } from "../helpers/roles.js";

export const articleRoutes = Router();

articleRoutes.get(ROUTES.BASE, getArticles);

articleRoutes.get(
  ROUTES.ARTICLE.GET_UNPUBLISHED_ARTICLES,
  auth([ROLES.ADMIN, ROLES.MANAGER]),
  getUnpublishedArticles
);

articleRoutes.get(ROUTES.ARTICLE.GET_ARTICLE_BY_URL, getArticleByUrl);

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

articleRoutes.delete(
  ROUTES.ARTICLE.DELETE_ARTICLE,
  auth([ROLES.ADMIN, ROLES.MANAGER]),
  deleteArticle
);
