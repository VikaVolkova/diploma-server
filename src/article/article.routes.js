const express = require("express");
const controller = require("./article.controller");

const articleRoutes = express.Router();

articleRoutes.get("/", controller.getArticles);

module.exports = articleRoutes;
