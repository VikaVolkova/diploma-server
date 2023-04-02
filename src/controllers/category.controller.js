import { RESPONSE_MESSAGES, ROLES } from "../helpers/index.js";
import * as service from "../services/category.service.js";

export const getCategories = async (req, res, next) => {
  try {
    const categories = await service.getCategories();
    return res.status(200).json(categories);
  } catch (err) {
    return next(err);
  }
};

export const getActiveCategories = async (req, res, next) => {
  try {
    const categories = await service.getCategories({ isDeleted: false });
    return res.status(200).json(categories);
  } catch (err) {
    return next(err);
  }
};

export const getCategoryByUrl = async (req, res, next) => {
  const { url } = req.params;
  const user = req.user;
  try {
    if (user.role != ROLES.ADMIN && user.role != ROLES.MANAGER) {
      return res.status(403).send(RESPONSE_MESSAGES.ACCESS_DENIED);
    }

    const category = await service.getCategoryByUrl(url);
    return res.status(200).json(category);
  } catch (err) {
    return next(err);
  }
};

export const createCategory = async (req, res, next) => {
  const user = req.user;
  try {
    if (user.role != ROLES.ADMIN && user.role != ROLES.MANAGER) {
      return res.status(403).send(RESPONSE_MESSAGES.ACCESS_DENIED);
    }
    const category = await service.createCategory({ ...req.body });
    res.status(201).send(category);
  } catch (err) {
    return next(err);
  }
};

export const updateCategory = async (req, res, next) => {
  const { id } = req.params;
  const { name, url } = req.body;
  const user = req.user;
  try {
    if (user.role != ROLES.ADMIN && user.role != ROLES.MANAGER) {
      return res.status(403).send(RESPONSE_MESSAGES.ACCESS_DENIED);
    }

    const category = await service.getCategory(id);
    if (!category) return res.status(404).send(RESPONSE_MESSAGES.NOT_FOUND);

    await service.updateCategory(id, name, url);

    const categories = await service.getCategories();
    res.status(200).json({ categories });
  } catch (err) {
    return next(err);
  }
};

export const deleteCategory = async (req, res, next) => {
  const { id } = req.params;
  const user = req.user;
  try {
    if (user.role != ROLES.ADMIN && user.role != ROLES.MANAGER) {
      return res.status(403).send(RESPONSE_MESSAGES.ACCESS_DENIED);
    }

    const category = await service.getCategory(id);
    if (!category) return res.status(404).send(RESPONSE_MESSAGES.NOT_FOUND);

    await service.toggleCategoryActive(id, category.isDeleted);

    const categories = await service.getCategories();
    res.status(200).json({ categories });
  } catch (err) {
    return next(err);
  }
};
