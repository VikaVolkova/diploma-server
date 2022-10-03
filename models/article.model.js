const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 200,
  },
  spoiler: {
    type: String,
    minlength: 30,
    maxlength: 10,
  },
  coverPicture: {
    type: String,
    minlength: 3,
    maxlength: 30,
  },
  picture: {
    type: String,
  },
  content: {
    type: String,
    default: new Date(),
  },
  category: {
    type: String,
  },
  author: String,
  isPublished: Boolean,
});

const Article = mongoose.model("Article", articleSchema);

exports.Article = Article;
