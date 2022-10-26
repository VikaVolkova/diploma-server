const { Article } = require("../models/article.model");
const { Category } = require("../models/category.model");
const { getParcedLimit } = require("../common/GetLimit");
const mongoose = require("mongoose");

const getArticles = async (req, res, next) => {
  const limit = getParcedLimit(Number(req.query.limit), 4, 10);
  const skip = Number(req.query.skip) || 0;
  try {
    const articles = await Article.find({ isPublished: true })
      .populate([
        {
          path: "category",
          model: "Category",
        },
        {
          path: "author",
          model: "User",
        },
        {
          path: "comments",
          model: "Comment",
        },
      ])
      .sort({ date: -1 })
      .limit(limit)
      .skip(skip);

    const count = await Article.find({ isPublished: true }).count();
    return res.status(200).json({
      articles,
      limit,
      skip,
      count,
    });
  } catch (err) {
    return next(err);
  }
};

const getArticleByUrl = async (req, res, next) => {
  const url = req.params.url;
  try {
    const article = await Article.findOne({ url: url });

    if (!article || !article.isPublished) {
      throw new Error("Article is not found");
    }

    return res.status(200).json(article);
  } catch (err) {
    return next(err);
  }
};

const getArticlesByCategoryUrl = async (req, res, next) => {
  const limit = getParcedLimit(Number(req.query.limit), 4, 10);
  const skip = Number(req.query.skip) || 0;
  const categoryUrl = req.params.categoryUrl;

  try {
    const category = await Category.findOne({ url: categoryUrl });
    const categoryId = category._id;
    const articles = await Article.find({
      category: categoryId,
    })
      .populate([
        {
          path: "category",
          model: "Category",
        },
        {
          path: "author",
          model: "User",
        },
        {
          path: "comments",
          model: "Comment",
        },
      ])
      .sort({ date: -1 })
      .limit(limit)
      .skip(skip);
    const count = await Article.find({ category: categoryId }).count();
    return res.status(200).json({
      articles,
      limit,
      skip,
      count,
    });
  } catch (err) {
    return next(err);
  }
};

const createArticle = async (req, res, next) => {
  let article = new Article({
    ...req.body,
    isPublished: false,
    date: new Date(),
  });

  try {
    article = await article.save();
    res.status(201).send(article);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const deleteArticle = async (req, res, next) => {
  const id = req.params.id;
  try {
    const article = await Article.findById(id);
    if (!article) return res.status(404).send("Article is not found");
    // if (article.uid !== req.user._id)
    //   return res.status(401).send("Todo deletion failed");
    const deletedTodo = await Article.findByIdAndDelete(id);
    res.status(200).send(deletedTodo);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

module.exports = {
  getArticles: getArticles,
  getArticleByUrl: getArticleByUrl,
  getArticlesByCategoryUrl: getArticlesByCategoryUrl,
  createArticle: createArticle,
  deleteArticle: deleteArticle,
};
