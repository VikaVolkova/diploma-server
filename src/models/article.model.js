const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { Category } = require("./category.model");
const { User } = require("./user.model");

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
  },
  spoiler: {
    type: String,
    required: true,
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
    required: true,
    minlength: 100,
    maxlength: 1000,
  },
  category: {
    type: String,
    ref: Category,
    required: true,
  },
  author: {
    type: String,
    ref: User,
  },
  isPublished: {
    type: Boolean,
  },
  date: {
    type: Date,
    default: new Date(),
  },
  url: {
    type: String,
    required: true,
    maxlength: 30,
  },
  comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
});

const Article = mongoose.model("Article", articleSchema);

exports.Article = Article;
