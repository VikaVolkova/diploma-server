import { Schema, model } from "mongoose";

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 30,
  },
  email: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
    unique: true,
  },
  image: {
    type: String,
  },
  role: {
    type: String,
    default: "USER",
  },
  googleUser: {
    type: Boolean,
    default: false,
  },
  password: {
    type: String,
    minlength: 6,
    maxlength: 1024,
  },
});

export const User = model("User", userSchema);
