import { Router } from "express";
import { getCategories, createCategory } from "./category.controller.js";
import { auth } from "../middleware/auth.js";
import { ROUTES } from "../helpers/routes.js";
import { ROLES } from "../helpers/roles.js";

export const categoryRoutes = Router();

categoryRoutes.get(ROUTES.BASE, getCategories);
categoryRoutes.post(
  ROUTES.BASE,
  auth([ROLES.ADMIN, ROLES.MANAGER]),
  createCategory
);
