const { User } = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { userSchemaRegister } = require("../validation/user");
const { userSchemaLogin } = require("../validation/user");
const { userSchemaForgotPassword } = require("../validation/user");
const { userSchemaRestorePassword } = require("../validation/user");
const sendEmail = require("../common/sendEmail");

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
      return res.status(404).send("Token does not exist");
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

      let options = {
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10),
        maxAge: 1000 * 60 * 60 * 24 * 10,
        secure: true,
        httpOnly: true,
      };

      res.cookie("refresh_token", refreshToken, options);

      return res.status(200).json({ user, accessToken });
    } else {
      return res.status(404).send();
    }
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

const forgotPassword = async (req, res, next) => {
  const { email } = req.body;

  const { error } = userSchemaForgotPassword.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .send("User with the provided email does not exist");
    }
    const payload = makeTokenPayload(user);
    const accessToken = makeAccessToken(payload);

    const url = `http://localhost:3000/restore-password?token=${accessToken}`;

    sendEmail(
      user.email,
      "LearnMe відновлення паролю",
      `Відновіть Ваш пароль за посиланням: ${url}`
    );
    return res.status(200).send("Link has been sent");
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

const restorePassword = async (req, res, next) => {
  const { password1, password2, token } = req.body;

  const { error } = userSchemaRestorePassword.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  if (!req.user) {
    return res.status(404).send("User not found");
  }

  if (password1 !== password2) {
    return res.status(500).send("Passwords is not equal");
  }
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_KEY);

    const user = await User.findById(decoded._id);
    if (!user) {
      return res
        .status(400)
        .send("User with the provided email does not exist");
    }
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password1, salt);
    await user.save();
    return res.status(200).send("Password successfully updated");
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

const logout = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(400).send("User not found");
    }

    res.clearCookie("refresh_token");

    return res.status(200).send();
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

const getUser = async (req, res, next) => {
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
  forgotPassword: forgotPassword,
  restorePassword: restorePassword,
  getUser: getUser,
  getAccessTokenByRefreshToken: getAccessTokenByRefreshToken,
  logout: logout,
};
