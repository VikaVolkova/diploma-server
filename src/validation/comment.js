const Joi = require("joi");

const commentSchema = Joi.object({
  text: Joi.string().required(),
  authorId: Joi.string().required(),
  articleId: Joi.string().required(),
});

exports.commentSchema = commentSchema;
