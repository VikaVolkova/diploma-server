import { Router } from "express";
import { getCategories, createCategory } from "./category.controller.js";
import { auth } from "../middleware/auth.js";
import { ROUTES } from "../helpers/routes.js";

export const categoryRoutes = Router();

categoryRoutes.get(ROUTES.BASE, getCategories);
categoryRoutes.post(ROUTES.BASE, auth, createCategory);
