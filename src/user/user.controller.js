const { User } = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { userSchemaRegister } = require("../validation/user");
const { userSchemaLogin } = require("../validation/user");

const makeTokenPayload = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
});

const makeAccessToken = (user) => {
  const payload = makeTokenPayload(user);
  const accessTokenLife = "1h";

  return (token = jwt.sign(payload, process.env.ACCESS_KEY, {
    expiresIn: accessTokenLife,
  }));
};

const register = async (req, res, next) => {
  const { name, email, password } = req.body;

  const { error } = userSchemaRegister.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    let user = await User.findOne({ email });
    if (user)
      return res.status(400).send("User with this email is already exist");

    user = new User({
      name,
      email,
      password,
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    await user.save();

    const token = makeAccessToken(user);

    res.send(token);
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  const { error } = userSchemaLogin.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    let user = await User.findOne({ email });
    if (!user)
      return res
        .status(400)
        .send("User with the provided email does not exist");

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(400).send("Invalid password");

    const token = makeAccessToken(user);

    res.send(token);
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

module.exports = {
  register: register,
  login: login,
};
