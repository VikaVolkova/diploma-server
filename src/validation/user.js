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

const userSchemaForgotPassword = Joi.object({
  email: Joi.string().min(3).max(200).email().required(),
});

const userSchemaRestorePassword = Joi.object({
  password1: Joi.string().min(6).max(1024).required(),
  password2: Joi.any().valid(Joi.ref("password1")).required(),
  token: Joi.string(),
});

exports.userSchemaRegister = userSchemaRegister;
exports.userSchemaLogin = userSchemaLogin;
exports.userSchemaForgotPassword = userSchemaForgotPassword;
exports.userSchemaRestorePassword = userSchemaRestorePassword;
