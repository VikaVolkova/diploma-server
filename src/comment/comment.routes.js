const express = require("express");
const controller = require("./comment.controller");
const auth = require("../middleware/auth");
const commentRoutes = express.Router();

commentRoutes.get("/article/:articleId", controller.getCommentsByArticleId);

commentRoutes.post("/", auth, controller.createComment);

module.exports = commentRoutes;
