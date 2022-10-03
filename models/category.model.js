const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 20,
    unique: true,
  },
});

const Category = mongoose.model("Category", categorySchema);

exports.Category = Category;
