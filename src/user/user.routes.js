const express = require("express");
const controller = require("./user.controller");

const userRoutes = express.Router();

userRoutes.post("/register", controller.register);

userRoutes.post("/login", controller.login);

module.exports = userRoutes;
