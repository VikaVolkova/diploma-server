const express = require("express");
const controller = require("./category.controller");

const categoryRoutes = express.Router();

categoryRoutes.get("/", controller.getCategories);
categoryRoutes.post("/", controller.createCategory);

module.exports = categoryRoutes;
