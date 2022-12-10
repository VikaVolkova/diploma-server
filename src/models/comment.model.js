import { Schema, model } from "mongoose";

const commentSchema = new Schema({
  text: {
    type: String,
    required: true,
  },
  isPublished: {
    type: Boolean,
  },
  authorId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  articleId: {
    type: Schema.Types.ObjectId,
    ref: "Article",
    required: true,
  },
});

export const Comment = model("Comment", commentSchema);
