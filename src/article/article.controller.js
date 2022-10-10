const { Article } = require("../models/article.model");
const { getParcedLimit } = require("../common/GetLimit");

const getArticles = async (req, res, next) => {
  const limit = getParcedLimit(Number(req.query.limit), 4, 10);
  const skip = Number(req.query.skip) || 0;
  try {
    const articles = await Article.find({ isPublished: true })
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

const getArticlesByCategoryId = async (req, res, next) => {
  const limit = getParcedLimit(Number(req.query.limit), 4, 10);
  const skip = Number(req.query.skip) || 0;
  const categoryId = Number(req.params.categoryId);
  try {
    const articles = await Article.find({
      category: categoryId,
      isPublished: true,
    })
      .sort({ date: -1 })
      .limit(limit)
      .skip(skip);

    const count = await Article.find({
      category: categoryId,
      isPublished: true,
    }).count();
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

module.exports = {
  getArticles: getArticles,
  getArticleByUrl: getArticleByUrl,
  getArticlesByCategoryId: getArticlesByCategoryId,
};
