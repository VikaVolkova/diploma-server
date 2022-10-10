const Joi = require("joi");

const userSchemaRegister = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().min(3).max(50).email().required(),
  role: Joi.string(),
  password: Joi.string().min(6).max(1024).required(),
});

const userSchemaLogin = Joi.object({
  email: Joi.string().min(3).max(200).email().required(),
  password: Joi.string().min(6).max(1024).required(),
});

exports.userSchemaRegister = userSchemaRegister;
exports.userSchemaLogin = userSchemaLogin;
