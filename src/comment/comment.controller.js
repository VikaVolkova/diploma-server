import { Types } from 'mongoose';
import { RESPONSE_MESSAGES, ROLES } from '../helpers/index.js';
import * as service from './comment.service.js';

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
  try {
    const { data, count } = await service.getUnpublishedComments();

    res.status(200).json({ data, count });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

export const publishComment = async (req, res, next) => {
  const _id = req.params.id;
  const user = req.user;
  try {
    const comment = await service.getComment({ _id });
    if (!comment) return res.status(404).send(RESPONSE_MESSAGES.NOT_FOUND);

    if (user.role != ROLES.ADMIN)
      return res.status(403).send(RESPONSE_MESSAGES.ACCESS_DENIED);

    const publishedComment = await service.publishComment({ _id });

    res.status(200).send(publishedComment);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

export const deleteComment = async (req, res, next) => {
  const _id = req.params.id;
  const user = req.user;
  try {
    const comment = await service.getComment({ _id });
    if (!comment) return res.status(404).send(RESPONSE_MESSAGES.NOT_FOUND);

    if (user.role != ROLES.ADMIN && user._id != comment.author._id)
      return res.status(403).send(RESPONSE_MESSAGES.ACCESS_DENIED);

    const data = await service.deleteComment(_id);

    res.status(200).send(data);
  } catch (err) {
    res.status(500).send(err.message);
  }
};
