import { Category } from "../models/category.model.js";

export const getCategories = async () => {
  const categories = await Category.find().sort({ date: 1 });
  return categories;
};

export const createCategory = async (data) => {
  let category = new Category({ ...data });
  category = await category.save();
  return category;
};
