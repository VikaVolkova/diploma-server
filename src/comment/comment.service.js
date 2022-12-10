import { Comment } from "../models/comment.model.js";

export const getCommentsByArticleId = async (articleId) => {
  const data = await Comment.find({
    articleId,
    isPublished: true,
  }).populate([
    {
      path: "authorId",
      model: "User",
    },
  ]);
  return data;
};

export const createComment = async (data) => {
  let comment = new Comment({ ...data, isPublished: false });
  comment = await comment.save();
  return comment;
};
