const express = require("express");
const controller = require("./article.controller");

const articleRoutes = express.Router();

articleRoutes.get("/", controller.getArticles);

articleRoutes.get("/:url", controller.getArticleByUrl);

articleRoutes.get(
  "/category/:categoryUrl",
  controller.getArticlesByCategoryUrl
);

articleRoutes.post("/", controller.createArticle);

module.exports = articleRoutes;
