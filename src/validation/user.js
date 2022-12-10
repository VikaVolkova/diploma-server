import Joi from "joi";

export const userSchemaRegister = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().min(3).max(50).email().required(),
  role: Joi.string(),
  password: Joi.string().min(6).max(1024).required(),
});

export const userSchemaLogin = Joi.object({
  email: Joi.string().min(3).max(200).email().required(),
  password: Joi.string().min(6).max(1024).required(),
});

export const userSchemaForgotPassword = Joi.object({
  email: Joi.string().min(3).max(200).email().required(),
});

export const userSchemaRestorePassword = Joi.object({
  password1: Joi.string().min(6).max(1024).required(),
  password2: Joi.any().valid(Joi.ref("password1")).required(),
  token: Joi.string(),
});
