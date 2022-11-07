const express = require("express");
const controller = require("./category.controller");
const auth = require("../middleware/auth");

const categoryRoutes = express.Router();

categoryRoutes.get("/", auth, controller.getCategories);
categoryRoutes.post("/", auth, controller.createCategory);

module.exports = categoryRoutes;
