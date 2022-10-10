const Joi = require("joi");

const articleSchema = Joi.object({
  title: Joi.string().min(3).max(50).required(),
  spoiler: Joi.string().min(30).max(100).required(),
  coverPicture: Joi.string(),
  picture: Joi.string(),
  content: Joi.string().min(100).max(1000).required(),
  category: Joi.string().required(),
  author: Joi.string(),
  isPublished: Joi.boolean(),
  date: Joi.date(),
  url: Joi.string().max(30).required(),
  comments: Joi.array(),
});

exports.articleSchema = articleSchema;
