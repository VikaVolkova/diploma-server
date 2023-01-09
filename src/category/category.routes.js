import { Router } from "express";
import {
  getCategories,
  createCategory,
  deleteCategory,
  getActiveCategories,
} from "./category.controller.js";
import { auth } from "../middleware/auth.js";
import { ROUTES } from "../helpers/routes.js";
import { ROLES } from "../helpers/roles.js";

export const categoryRoutes = Router();

categoryRoutes.get(ROUTES.CATEGORY.GET_ALL_CATEGORIES, getCategories);

categoryRoutes.get(ROUTES.CATEGORY.GET_ACTIVE_CATEGORIES, getActiveCategories);

categoryRoutes.post(
  ROUTES.BASE,
  auth([ROLES.ADMIN, ROLES.MANAGER]),
  createCategory
);

categoryRoutes.put(
  ROUTES.CATEGORY.DELETE,
  auth([ROLES.ADMIN, ROLES.MANAGER]),
  deleteCategory
);
