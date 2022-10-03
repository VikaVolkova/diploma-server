const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  authorId: {
    type: String,
    required: true,
  },
  articleId: {
    type: String,
    required: true,
  },
});

const Comment = mongoose.model("Comment", commentSchema);

exports.Comment = Comment;
