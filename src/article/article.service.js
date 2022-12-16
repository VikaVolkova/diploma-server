import { Article } from "../models/article.model.js";
import { Category } from "../models/category.model.js";

export const getArticles = async (query, limit, skip) => {
  const data = await Article.find(query)
    .populate([
      "category",
      "author",
      { path: "comments", match: { isPublished: true } },
    ])
    .sort({ date: -1 })
    .limit(limit)
    .skip(skip);

  const count = await Article.find(query).count();

  return { data, count };
};

export const getArticle = async (data) => {
  const article = await Article.findOne(data).populate([
    "category",
    "author",
    { path: "comments", match: { isPublished: true } },
  ]);
  return article;
};

export const getArticlesByCategoryUrl = async (skip, limit, categoryUrl) => {
  const category = await Category.findOne({ url: categoryUrl });
  const categoryId = category._id;
  const query = {
    category: categoryId,
    isPublished: true,
  };

  const { data, count } = await getArticles(query, limit, skip);

  return { data, count };
};

export const createArticle = async (data) => {
  let article = new Article({
    ...data,
    isPublished: false,
    date: new Date(),
  });
  article = await article.save();
  return article;
};

export const togglePublish = async (id, isPublished) => {
  const publishedArticle = await Article.findByIdAndUpdate(id, {
    isPublished,
  });
  return publishedArticle;
};

export const deleteArticle = async (id) => {
  const deletedArticle = await Article.findByIdAndDelete(id);
  return deletedArticle;
};
