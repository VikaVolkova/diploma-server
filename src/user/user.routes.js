import { Router } from "express";
import {
  register,
  login,
  forgotPassword,
  restorePassword,
  logout,
  getUser,
  getAccessTokenByRefreshToken,
} from "./user.controller.js";
import { auth } from "../middleware/auth.js";
import { check } from "express-validator";
import { REFRESH_TOKEN } from "./user.controller.js";
import { ROUTES } from "../helpers/routes.js";

export const userRoutes = Router();

userRoutes.post(ROUTES.USER.REGISTER, register);

userRoutes.post(ROUTES.USER.LOGIN, login);

userRoutes.post(ROUTES.USER.FORGOT_PASSWORD, forgotPassword);

userRoutes.post(ROUTES.USER.RESTORE_PASSWORD, auth, restorePassword);

userRoutes.get(ROUTES.USER.LOGOUT, auth, logout);

userRoutes.get(ROUTES.USER.GET_USER, auth, getUser);

userRoutes.get(
  ROUTES.USER.GET_ACCESS_TOKEN_BY_REFRESH_TOKEN,
  check(REFRESH_TOKEN).exists(),
  getAccessTokenByRefreshToken
);
