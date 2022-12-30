import { Router } from "express";
import {
  register,
  login,
  forgotPassword,
  restorePassword,
  logout,
  getUser,
  getAccessTokenByRefreshToken,
  getAllUsers,
  updateRole,
  checkPassword,
  updateUser,
  deleteUser,
  toggleBlockUser,
} from "./user.controller.js";
import { auth } from "../middleware/auth.js";
import { check } from "express-validator";
import { REFRESH_TOKEN } from "./user.controller.js";
import { ROUTES } from "../helpers/routes.js";
import { ROLES } from "../helpers/roles.js";

export const userRoutes = Router();

userRoutes.post(ROUTES.USER.REGISTER, register);

userRoutes.post(ROUTES.USER.LOGIN, login);

userRoutes.post(ROUTES.USER.FORGOT_PASSWORD, forgotPassword);

userRoutes.post(
  ROUTES.USER.RESTORE_PASSWORD,
  auth([ROLES.ADMIN, ROLES.MANAGER, ROLES.USER]),
  restorePassword
);

userRoutes.post(
  ROUTES.USER.CHECK_PASSWORD,
  auth([ROLES.ADMIN, ROLES.MANAGER, ROLES.USER]),
  checkPassword
);

userRoutes.get(
  ROUTES.USER.LOGOUT,
  auth([ROLES.ADMIN, ROLES.MANAGER, ROLES.USER]),
  logout
);

userRoutes.get(
  ROUTES.USER.GET_USER,
  auth([ROLES.ADMIN, ROLES.MANAGER, ROLES.USER]),
  getUser
);

userRoutes.put(
  ROUTES.USER.UPDATE_USER,
  auth([ROLES.ADMIN, ROLES.MANAGER, ROLES.USER]),
  updateUser
);

userRoutes.delete(
  ROUTES.USER.DELETE_USER,
  auth([ROLES.ADMIN, ROLES.MANAGER, ROLES.USER]),
  deleteUser
);

userRoutes.get(ROUTES.USER.GET_ALL_USERS, auth([ROLES.ADMIN]), getAllUsers);

userRoutes.put(ROUTES.BASE, auth([ROLES.ADMIN]), updateRole);

userRoutes.put(
  ROUTES.USER.TOGGLE_BLOCK_USER,
  auth([ROLES.ADMIN]),
  toggleBlockUser
);

userRoutes.get(
  ROUTES.USER.GET_ACCESS_TOKEN_BY_REFRESH_TOKEN,
  check(REFRESH_TOKEN).exists(),
  getAccessTokenByRefreshToken
);
