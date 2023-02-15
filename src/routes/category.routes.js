import { Router } from 'express';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getActiveCategories,
  getCategoryByUrl,
} from '../category/category.controller.js';
import { auth } from '../middlewares/auth.js';
import { ROUTES } from '../helpers/routes.js';
import { ROLES } from '../helpers/roles.js';

export const categoryRoutes = Router();

categoryRoutes.get(ROUTES.CATEGORY.GET_ALL_CATEGORIES, getCategories);

categoryRoutes.get(ROUTES.CATEGORY.GET_ACTIVE_CATEGORIES, getActiveCategories);

categoryRoutes.get(
  ROUTES.CATEGORY.GET_CATEGORY_BY_URL,
  auth([ROLES.ADMIN, ROLES.MANAGER]),
  getCategoryByUrl
);

categoryRoutes.post(
  ROUTES.BASE,
  auth([ROLES.ADMIN, ROLES.MANAGER]),
  createCategory
);

categoryRoutes.put(
  ROUTES.CATEGORY.UPDATE,
  auth([ROLES.ADMIN, ROLES.MANAGER]),
  updateCategory
);

categoryRoutes.put(
  ROUTES.CATEGORY.DELETE,
  auth([ROLES.ADMIN, ROLES.MANAGER]),
  deleteCategory
);
