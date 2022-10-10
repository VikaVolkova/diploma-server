const Joi = require("joi");

const categorySchema = Joi.object({
  category: Joi.string().min(2).max(20).required(),
  url: Joi.string().min(2).max(20).required(),
});

exports.categorySchema = categorySchema;
