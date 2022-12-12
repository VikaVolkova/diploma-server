import { Types } from "mongoose";
import { getParcedLimit } from "../utils/getLimit.js";
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

export const getUnpublishedComments = async (req, res, next) => {
  const limit = getParcedLimit(Number(req.query.limit), 4, 10);
  const skip = Number(req.query.skip) || 0;
  try {
    const { data, count } = await service.getUnpublishedComments(limit, skip);
    res.status(200).json({ data, count, limit, skip });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};
