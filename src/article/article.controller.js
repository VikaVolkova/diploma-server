const { Article } = require("../models/article.model");
const { Category } = require("../models/category.model");
const { getParcedLimit } = require("../common/getLimit");

const getArticles = async (req, res, next) => {
  const limit = getParcedLimit(Number(req.query.limit), 4, 10);
  const skip = Number(req.query.skip) || 0;
  try {
    const data = await Article.find({ isPublished: true })
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
      data,
      limit,
      skip,
      count,
    });
  } catch (err) {
    return next(err);
  }
};

const getArticleByUrl = async (req, res, next) => {
  const { newsUrl } = req.params;
  try {
    const article = await Article.findOne({ url: newsUrl });

    if (!article || !article.isPublished) {
      throw new Error("Article is not found");
    }

    return res.status(200).json({ article });
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
    const data = await Article.find({
      category: categoryId,
      isPublished: true,
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
      data,
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

const publishArticle = async (req, res, next) => {
  const id = req.params.id;
  const user = req.user;
  try {
    const article = await Article.findById(id);
    if (!article) return res.status(404).send("Article is not found");
    if (user.role != "ADMIN") return res.status(401).send("Access denied");
    const publishedArticle = await Article.findByIdAndUpdate(id, {
      isPublished: true,
    });
    res.status(200).send(publishedArticle);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const deleteArticle = async (req, res, next) => {
  const id = req.params.id;
  const user = req.user;
  try {
    const article = await Article.findById(id);
    if (!article) return res.status(404).send("Article is not found");
    if (user.role != "ADMIN") return res.status(401).send("Access denied");
    const deletedArticle = await Article.findByIdAndDelete(id);
    res.status(200).send(deletedArticle);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

module.exports = {
  getArticles: getArticles,
  getArticleByUrl: getArticleByUrl,
  getArticlesByCategoryUrl: getArticlesByCategoryUrl,
  createArticle: createArticle,
  publishArticle: publishArticle,
  deleteArticle: deleteArticle,
};
