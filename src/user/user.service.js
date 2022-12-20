import { User } from "../models/user.model.js";
import { genSalt, hash } from "bcrypt";
import { RESPONSE } from "../helpers/response.js";

export const findUser = async (email) => {
  let user = await User.findOne({ email });
  return user;
};

export const register = async (data) => {
  let user = new User({
    ...data,
  });

  const salt = await genSalt(10);
  user.password = await hash(user.password, salt);

  await user.save();
};

export const restorePassword = async (email, password) => {
  const user = await findUser(email);
  if (!user) {
    return res.status(400).send(RESPONSE.USER.NOT_EXIST);
  }
  const salt = await genSalt(10);
  user.password = await hash(password, salt);
  await user.save();
};

export const findAllUsers = async () => {
  let users = await User.find();
  let count = await User.find().count();
  return { users, count };
};

export const updateUserRole = async (id, role) => {
  await User.findByIdAndUpdate(id, { role });
};

export const updateUser = async (id, name, email, image) => {
  await User.findByIdAndUpdate(id, { name, email, image });
};
