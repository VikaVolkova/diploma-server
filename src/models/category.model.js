const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
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

const Category = mongoose.model("Category", categorySchema);

exports.Category = Category;
