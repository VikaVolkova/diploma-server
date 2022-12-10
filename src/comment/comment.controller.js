import { Types } from "mongoose";
import * as service from "./comment.service.js";

export const getCommentsByArticleId = async (req, res, next) => {
  const articleId = Types.ObjectId(req.params.articleId);
  try {
    const data = await service.getCommentsByArticleId(articleId);
    res.status(200).send({ data });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

export const createComment = async (req, res, next) => {
  try {
    const comment = await service.createComment({ ...req.body });
    res.status(201).send(comment);
  } catch (err) {
    res.status(500).send(err.message);
  }
};
