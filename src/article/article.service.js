import { Article } from '../models/article.model.js';
import { Category } from '../models/category.model.js';

export const getArticles = async (query) => {
  const data = await Article.find(query)
    .populate([
      'category',
      'author',
      { path: 'comments', match: { isPublished: true } },
    ])
    .sort({ date: -1 });

  const count = await Article.find(query).count();

  return { data, count };
};

export const getPopularArticles = async () => {
  const data = await Article.find({ isPublished: true, isDeleted: false })
    .populate([
      'category',
      'author',
      { path: 'comments', match: { isPublished: true } },
    ])
    .sort({ likes: -1 })
    .limit(4);
  return data;
};

export const getArticle = async (data) => {
  const article = await Article.findOne(data).populate(['category', 'author']);
  return article;
};

export const getArticlesByCategoryUrl = async (categoryUrl) => {
  const category = await Category.findOne({ url: categoryUrl });
  const categoryId = category._id;
  const query = {
    category: categoryId,
    isPublished: true,
    isDeleted: false,
  };

  const { data, count } = await getArticles(query);

  return { data, count };
};

export const createArticle = async (data) => {
  let article = new Article({
    ...data,
    isPublished: false,
    isDeleted: false,
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
  const deletedArticle = await Article.findByIdAndUpdate(id, {
    isDeleted: true,
  });
  return deletedArticle;
};

export const updateArticle = async (id, data) => {
  const updatedArticle = await Article.findByIdAndUpdate(id, { ...data });
  return updatedArticle;
};

export const toggleLike = async (id, userId, liked) => {
  liked
    ? await Article.findByIdAndUpdate(id, { $push: { likes: userId } })
    : await Article.findByIdAndUpdate(id, { $pull: { likes: userId } });
};

export const toggleComment = async (id, commentId, deleted) => {
  !deleted
    ? await Article.findByIdAndUpdate(id, { $push: { comments: commentId } })
    : await Article.findByIdAndUpdate(id, { $pull: { comments: commentId } });
};
