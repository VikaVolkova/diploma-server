import { Schema, model } from "mongoose";

const commentSchema = new Schema({
  text: {
    type: String,
    required: true,
  },
  isPublished: {
    type: Boolean,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  article: {
    type: Schema.Types.ObjectId,
    ref: "Article",
    required: true,
  },
  date: {
    type: Date,
    default: new Date(),
  },
});

export const Comment = model("Comment", commentSchema);
