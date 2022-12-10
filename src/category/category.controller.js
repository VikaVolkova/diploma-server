import { ROLES } from "../helpers/roles.js";
import { RESPONSE } from "../helpers/response.js";
import * as service from "./category.service.js";

export const getCategories = async (req, res, next) => {
  try {
    const categories = await service.getCategories();
    return res.status(200).json(categories);
  } catch (err) {
    return next(err);
  }
};

export const createCategory = async (req, res, next) => {
  const user = req.user;
  try {
    if (user.role != ROLES.ADMIN && user.role != ROLES.MANAGER) {
      return res.status(403).send(RESPONSE.ACCESS_DENIED);
    }
    const category = await service.createCategory({ ...req.body });
    res.status(201).send(category);
  } catch (err) {
    return next(err);
  }
};
