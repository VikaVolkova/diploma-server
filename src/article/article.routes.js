const express = require("express");
const controller = require("./article.controller");
const auth = require("../middleware/auth");

const articleRoutes = express.Router();

articleRoutes.get("/", auth, controller.getArticles);

articleRoutes.get("/:url", auth, controller.getArticleByUrl);

articleRoutes.get(
  "/category/:categoryUrl",
  auth,
  controller.getArticlesByCategoryUrl
);

articleRoutes.post("/", auth, controller.createArticle);

articleRoutes.post("/publish/:id", auth, controller.publishArticle);

articleRoutes.delete("/:id", auth, controller.deleteArticle);

module.exports = articleRoutes;
