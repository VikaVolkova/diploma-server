import Joi from "joi";

export const categorySchema = Joi.object({
  category: Joi.string().min(2).max(20).required(),
  url: Joi.string().min(2).max(20).required(),
});
