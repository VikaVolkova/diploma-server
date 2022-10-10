const express = require("express");
const controller = require("./article.controller");

const articleRoutes = express.Router();

articleRoutes.get("/", controller.getArticles);

articleRoutes.get("/:url", controller.getArticleByUrl);

module.exports = articleRoutes;
