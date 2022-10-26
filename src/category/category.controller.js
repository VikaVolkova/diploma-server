const { Category } = require("../models/category.model");

const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ date: 1 });
    return res.status(200).json(categories);
  } catch (err) {
    return next(err);
  }
};

const createCategory = async (req, res, next) => {
  let category = new Category({ ...req.body });
  try {
    category = await category.save();
    res.status(201).send(category);
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  getCategories: getCategories,
  createCategory: createCategory,
};
