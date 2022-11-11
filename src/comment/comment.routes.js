const express = require("express");
const controller = require("./comment.controller");
const auth = require("../middleware/auth");
const commentRoutes = express.Router();

commentRoutes.get("/:articleId", controller.getCommentsByArticleId);

module.exports = commentRoutes;
