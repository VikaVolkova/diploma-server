const express = require("express");
const controller = require("./user.controller");
const auth = require("../middleware/auth");
const { check } = require("express-validator");

const userRoutes = express.Router();

userRoutes.post("/register", controller.register);

userRoutes.post("/login", controller.login);

userRoutes.post("/forgot-password", controller.forgotPassword);

userRoutes.post("/restore-password", auth, controller.restorePassword);

userRoutes.get("/logout", auth, controller.logout);

userRoutes.get("/me", auth, controller.getUser);

userRoutes.get(
  "/token",
  check("refresh_token").exists(),
  controller.getAccessTokenByRefreshToken
);

module.exports = userRoutes;
