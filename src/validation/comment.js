import Joi from "joi";

export const commentSchema = Joi.object({
  text: Joi.string().required(),
  authorId: Joi.string().required(),
  articleId: Joi.string().required(),
});
