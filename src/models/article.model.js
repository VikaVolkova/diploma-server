const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
  },
  spoiler: {
    type: String,
    minlength: 30,
    maxlength: 100,
  },
  coverPicture: {
    type: String,
  },
  picture: {
    type: String,
  },
  content: {
    type: String,
    minlength: 100,
    maxlength: 1000,
  },
  category: {
    type: String,
  },
  author: String,
  isPublished: Boolean,
  date: {
    type: Date,
    default: new Date(),
  },
  url: {
    type: String,
    maxlength: 30,
  },
});

const Article = mongoose.model("Article", articleSchema);

exports.Article = Article;
