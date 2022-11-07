const { Comment } = require("../models/comment.model");
const mongoose = require("mongoose");

const getCommentsByArticleId = async (req, res, next) => {
  const articleId = mongoose.Types.ObjectId(req.params.articleId);
  try {
    const comments = await Comment.find({
      articleId: articleId,
    }).populate([
      {
        path: "authorId",
        model: "User",
      },
    ]);
    res.status(200).send(comments);
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

module.exports = {
  getCommentsByArticleId: getCommentsByArticleId,
};
