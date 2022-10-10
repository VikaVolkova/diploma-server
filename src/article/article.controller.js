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

exports.getArticles = getArticles;