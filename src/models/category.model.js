import { Schema, model } from "mongoose";

const categorySchema = new Schema({
  category: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 20,
    unique: true,
  },
  url: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 20,
    unique: true,
  },
});

export const Category = model("Category", categorySchema);
