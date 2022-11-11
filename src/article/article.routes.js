const express = require("express");
const controller = require("./article.controller");
const auth = require("../middleware/auth");

const articleRoutes = express.Router();

articleRoutes.get("/", controller.getArticles);

articleRoutes.get("/:url", controller.getArticleByUrl);

articleRoutes.get(
  "/category/:categoryUrl",
  controller.getArticlesByCategoryUrl
);

articleRoutes.post("/", auth, controller.createArticle);

articleRoutes.post("/publish/:id", auth, controller.publishArticle);

articleRoutes.delete("/:id", auth, controller.deleteArticle);

module.exports = articleRoutes;
