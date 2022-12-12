import { Comment } from "../models/comment.model.js";

export const getCommentsByArticleId = async (articleId) => {
  const data = await Comment.find({
    articleId,
    isPublished: true,
  }).populate([
    {
      path: "articleId",
      model: "Article",
    },
    {
      path: "authorId",
      model: "User",
    },
  ]);
  return data;
};

export const createComment = async (data) => {
  let comment = new Comment({ ...data, isPublished: false, date: new Date() });
  comment = await comment.save();
  return comment;
};

export const getUnpublishedComments = async (limit, skip) => {
  const data = await Comment.find({ isPublished: false })
    .populate([
      {
        path: "articleId",
        model: "Article",
      },
      {
        path: "authorId",
        model: "User",
      },
    ])
    .sort({ date: -1 })
    .limit(limit)
    .skip(skip);

  const count = await Comment.find({ isPublished: false }).count();
  return { data, count };
};
