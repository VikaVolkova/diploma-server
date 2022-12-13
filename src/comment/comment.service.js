import { Comment } from "../models/comment.model.js";

export const getCommentsByArticleId = async (article) => {
  const data = await Comment.find({
    article,
    isPublished: true,
  }).populate(["article", "author"]);
  return data;
};

export const createComment = async (data) => {
  let comment = new Comment({ ...data, isPublished: false, date: new Date() });
  comment = await comment.save();
  return comment;
};

export const getUnpublishedComments = async (limit, skip) => {
  const data = await Comment.find({ isPublished: false })
    .populate(["article", "author"])
    .sort({ date: -1 })
    .limit(limit)
    .skip(skip);

  const count = await Comment.find({ isPublished: false }).count();
  return { data, count };
};

export const getComment = async (id) => {
  const comment = await Comment.findById(id);
  return comment;
};

export const publishComment = async (id) => {
  const publishedComment = await Comment.findByIdAndUpdate(id, {
    isPublished: true,
  });
  return publishedComment;
};

export const deleteArticle = async (id) => {
  const comment = await Comment.findByIdAndDelete(id);
  return comment;
};
