import { Schema, model } from "mongoose";
import { Category } from "./category.model.js";
import { User } from "./user.model.js";

const articleSchema = new Schema({
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
  coverImage: {
    type: String,
  },
  content: {
    type: String,
    required: true,
    minlength: 100,
    maxlength: 10000,
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
  likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

export const Article = model("Article", articleSchema);
