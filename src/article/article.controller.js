import { getParcedLimit } from "../utils/getLimit.js";
import { RESPONSE } from "../helpers/response.js";
import { ROLES } from "../helpers/roles.js";
import * as service from "./article.service.js";
import mongoose from "mongoose";

export const getArticles = async (req, res, next) => {
  const limit = getParcedLimit(Number(req.query.limit), 10, 10);
  const skip = Number(req.query.skip) || 0;
  const query = { isPublished: true };
  try {
    const { data, count } = await service.getArticles(query, limit, skip);
    return res.status(200).json({
      data,
      limit,
      skip,
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
      res.status(404).send(RESPONSE.NOT_FOUND);
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
      res.status(404).send(RESPONSE.NOT_FOUND);
    }
    await service.toggleLike(_id, userId, liked);
    const data = await service.getArticle({ _id });
    return res.status(200).json({ data });
  } catch (err) {
    return next(err);
  }
};

export const getArticlesByCategoryUrl = async (req, res, next) => {
  const limit = getParcedLimit(Number(req.query.limit), 4, 10);
  const skip = Number(req.query.skip) || 0;
  const categoryUrl = req.params.categoryUrl;

  try {
    const { data, count } = await service.getArticlesByCategoryUrl(
      skip,
      limit,
      categoryUrl
    );
    return res.status(200).json({
      data,
      limit,
      skip,
      count,
    });
  } catch (err) {
    return next(err);
  }
};

export const getUnpublishedArticles = async (req, res, next) => {
  const limit = getParcedLimit(Number(req.query.limit), 10, 10);
  const skip = Number(req.query.skip) || 0;
  const user = req.user;

  const query =
    user.role === ROLES.ADMIN
      ? { isPublished: false }
      : { isPublished: false, author: user._id };

  try {
    const { data, count } = await service.getArticles(query, limit, skip);
    return res.status(200).json({
      data,
      limit,
      skip,
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
    if (!article) return res.status(404).send(RESPONSE.NOT_FOUND);
    if (user.role != ROLES.ADMIN)
      return res.status(403).send(RESPONSE.ACCESS_DENIED);
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
    if (!article) return res.status(404).send(RESPONSE.ARTICLE.NOT_FOUND);
    if (user.role != ROLES.ADMIN && user.role != ROLES.MANAGER)
      return res.status(403).send(RESPONSE.ACCESS_DENIED);
    const deletedArticle = await service.deleteArticle(_id);
    res.status(200).send(deletedArticle);
  } catch (err) {
    res.status(500).send(err.message);
  }
};
