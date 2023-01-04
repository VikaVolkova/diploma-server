import { Category } from "../models/category.model.js";

export const getCategories = async (query) => {
  const categories = await Category.find(query).sort({ date: 1 });
  return categories;
};

export const getCategory = async (id) => {
  const category = await Category.findById(id);
  return category;
};

export const createCategory = async (data) => {
  let category = new Category({ ...data });
  category = await category.save();
  return category;
};

export const toggleCategoryActive = async (id, isDeleted) => {
  const deletedCategory = await Category.findByIdAndUpdate(id, {
    isDeleted: !isDeleted,
  });
  return deletedCategory;
};
