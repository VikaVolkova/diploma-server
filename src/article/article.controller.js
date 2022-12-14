import { RESPONSE_MESSAGES, ROLES } from "../helpers/index.js";
import * as service from "./article.service.js";
import mongoose from "mongoose";

export const getArticles = async (req, res, next) => {
  const query = { isPublished: true, isDeleted: false };
  try {
    const { data, count } = await service.getArticles(query);

    return res.status(200).json({
      data,
      count,
    });
  } catch (err) {
    return next(err);
  }
};

export const getPopularArticles = async (req, res, next) => {
  try {
    const data = await service.getPopularArticles();

    return res.status(200).json({
      data,
    });
  } catch (err) {
    return next(err);
  }
};

export const getArticleByUrl = async (req, res, next) => {
  const url = req.params.newsUrl;
  try {
    const article = await service.getArticle({ url });
    if (!article) {
      res.status(404).send(RESPONSE_MESSAGES.NOT_FOUND);
    }

    return res.status(200).json({ article });
  } catch (err) {
    return next(err);
  }
};

export const toggleLike = async (req, res, next) => {
  const _id = req.params.id;
  const { liked } = req.body;
  const userId = mongoose.Types.ObjectId(req.user._id);
  try {
    const article = await service.getArticle({ _id });
    if (!article) {
      res.status(404).send(RESPONSE_MESSAGES.NOT_FOUND);
    }

    await service.toggleLike(_id, userId, liked);

    const data = await service.getArticle({ _id });

    return res.status(200).json({ data });
  } catch (err) {
    return next(err);
  }
};

export const toggleComment = async (req, res, next) => {
  const _id = req.params.id;
  const { deleted } = req.body;
  const commentId = mongoose.Types.ObjectId(req.body.commentId);
  try {
    const article = await service.getArticle({ _id });
    if (!article) {
      res.status(404).send(RESPONSE_MESSAGES.NOT_FOUND);
    }

    await service.toggleComment(_id, commentId, deleted);

    const data = await service.getArticle({ _id });

    return res.status(200).json({ data });
  } catch (err) {
    return next(err);
  }
};

export const getArticlesByCategoryUrl = async (req, res, next) => {
  const categoryUrl = req.params.categoryUrl;

  try {
    const { data, count } = await service.getArticlesByCategoryUrl(categoryUrl);

    return res.status(200).json({
      data,
      count,
    });
  } catch (err) {
    return next(err);
  }
};

export const getUnpublishedArticles = async (req, res, next) => {
  const user = req.user;
  const author = user.role === ROLES.MANAGER ? { author: user._id } : null;

  const query = {
    isPublished: false,
    isDeleted: false,
    ...author,
  };

  try {
    const { data, count } = await service.getArticles(query);

    return res.status(200).json({
      data,
      count,
    });
  } catch (err) {
    return next(err);
  }
};

export const createArticle = async (req, res, next) => {
  try {
    const article = await service.createArticle(req.body);
    res.status(201).send(article);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

export const publishArticle = async (req, res, next) => {
  const _id = req.params.id;
  const isPublished = req.query.isPublished;
  const user = req.user;
  try {
    const article = await service.getArticle({ _id });
    if (!article) return res.status(404).send(RESPONSE_MESSAGES.NOT_FOUND);

    if (user.role != ROLES.ADMIN)
      return res.status(403).send(RESPONSE_MESSAGES.ACCESS_DENIED);

    const updatedArticle = await service.togglePublish(_id, isPublished);

    res.status(200).send(updatedArticle);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

export const deleteArticle = async (req, res, next) => {
  const _id = req.params.id;
  const user = req.user;
  try {
    const article = await service.getArticle({ _id });
    if (!article) return res.status(404).send(RESPONSE_MESSAGES.NOT_FOUND);

    if (user.role != ROLES.ADMIN && user.role != ROLES.MANAGER)
      return res.status(403).send(RESPONSE_MESSAGES.ACCESS_DENIED);

    const deletedArticle = await service.deleteArticle(_id);

    res.status(200).send(deletedArticle);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

export const updateArticle = async (req, res, next) => {
  const _id = req.params.id;
  const user = req.user;
  const data = req.body;
  try {
    const article = await service.getArticle({ _id });
    if (!article) return res.status(404).send(RESPONSE_MESSAGES.NOT_FOUND);

    if (user.role != ROLES.ADMIN && user.role != ROLES.MANAGER)
      return res.status(403).send(RESPONSE_MESSAGES.ACCESS_DENIED);

    const updatedArticle = await service.updateArticle(_id, data);

    res.status(200).send(updatedArticle);
  } catch (err) {
    res.status(500).send(err.message);
  }
};
