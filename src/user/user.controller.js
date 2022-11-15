const { User } = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { userSchemaRegister } = require("../validation/user");
const { userSchemaLogin } = require("../validation/user");

const makeTokenPayload = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
});

const makeAccessToken = (user) => {
  const payload = makeTokenPayload(user);
  const accessTokenLife = "1h";

  return (token = jwt.sign(payload, process.env.ACCESS_KEY, {
    expiresIn: accessTokenLife,
  }));
};

const makeRefreshToken = (payload) => {
  const refreshTokenLife = "10d";

  return jwt.sign(payload, process.env.REFRESH_TOKEN_KEY, {
    expiresIn: refreshTokenLife,
  });
};

const getAccessTokenByRefreshToken = async (req, res, next) => {
  try {
    const { refresh_token } = req.cookies;

    if (!refresh_token) {
      return next(new Exception(404, "Token does not exist"));
    }

    const decoded = jwt.verify(refresh_token, process.env.REFRESH_TOKEN_KEY);

    const payload = {
      user_id: decoded.user_id,
      user_role: decoded.user_role,
      email: decoded.email,
    };

    const accessToken = makeAccessToken(payload);

    res.status(200).json({ accessToken });
  } catch (err) {
    return next(err);
  }
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

    res.status(201).send();
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
    if (!user) {
      return res
        .status(400)
        .send("User with the provided email does not exist");
    }

    if (await bcrypt.compare(password, user.password)) {
      const payload = makeTokenPayload(user);
      const accessToken = makeAccessToken(payload);
      const refreshToken = makeRefreshToken(payload);

      res.cookie("refresh_token", refreshToken, {
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10),
        maxAge: 1000 * 60 * 60 * 24 * 10,
        httpOnly: true,
      });

      return res.status(200).json({ user, accessToken });
    }
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

const getMe = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(404).send("User not found");
    }

    const user = await User.findOne({ _id: req.user._id });

    if (!user) {
      return res.status(404).send("User not found");
    }

    return res.status(200).json({ user });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

module.exports = {
  register: register,
  login: login,
  getMe: getMe,
  getAccessTokenByRefreshToken: getAccessTokenByRefreshToken,
};
