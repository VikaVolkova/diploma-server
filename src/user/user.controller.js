import { genSalt, hash, compare } from "bcrypt";
import {
  userSchemaRegister,
  userSchemaLogin,
  userSchemaForgotPassword,
  userSchemaRestorePassword,
} from "../validation/user.js";
import { sendEmail } from "../utils/sendEmail.js";
import jwt from "jsonwebtoken";
import { RESPONSE } from "../helpers/response.js";
import { RESTORE_PASSWORD_URL } from "../helpers/constants.js";
import * as service from "./user.service.js";
import { getParcedLimit } from "../utils/getLimit.js";

export const REFRESH_TOKEN = "refreshToken";
export const ACCESS_TOKEN = "accessToken";

const makeTokenPayload = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  image: user.image,
});

const makeAccessToken = (user) => {
  const payload = makeTokenPayload(user);
  const accessTokenLife = "1h";

  return jwt.sign(payload, process.env.ACCESS_KEY, {
    expiresIn: accessTokenLife,
  });
};

const makeRefreshToken = (payload) => {
  const refreshTokenLife = "10d";

  return jwt.sign(payload, REFRESH_TOKEN, {
    expiresIn: refreshTokenLife,
  });
};

export const getAccessTokenByRefreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res.status(404).send(RESPONSE.USER.NO_TOKEN);
    }

    const decoded = jwt.verify(refreshToken, REFRESH_TOKEN);

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

export const register = async (req, res, next) => {
  const { name, email, password } = req.body;

  const { error } = userSchemaRegister.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const user = await service.findUser(email);
    if (user) return res.status(400).send(RESPONSE.USER.EMAIL_EXISTS);
    await service.register({ name, email, password });

    res.status(201).send();
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  const { error } = userSchemaLogin.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const user = await service.findUser(email);
    if (!user) {
      return res.status(400).send(RESPONSE.USER.NOT_EXIST);
    }

    if (await compare(password, user.password)) {
      const payload = makeTokenPayload(user);
      const accessToken = makeAccessToken(payload);
      const refreshToken = makeRefreshToken(payload);

      res.cookie(REFRESH_TOKEN, refreshToken, {
        secure: true,
        httpOnly: true,
      });

      return res.status(200).json({ user, accessToken });
    } else {
      return res.status(404).send();
    }
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

export const forgotPassword = async (req, res, next) => {
  const { email } = req.body;

  const { error } = userSchemaForgotPassword.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  try {
    let user = await service.findUser(email);
    if (!user) {
      return res.status(400).send(RESPONSE.USER.NOT_EXIST);
    }
    const payload = makeTokenPayload(user);
    const accessToken = makeAccessToken(payload);

    const url = `${RESTORE_PASSWORD_URL}${accessToken}`;

    sendEmail(user.email, url);
    return res.status(200).send();
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

export const restorePassword = async (req, res, next) => {
  const { password1, password2, token } = req.body;

  const { error } = userSchemaRestorePassword.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  if (!req.user) {
    return res.status(404).send(RESPONSE.USER.NOT_FOUND);
  }

  if (password1 !== password2) {
    return res.status(400).send(RESPONSE.USER.NOT_EQUAL_PASS);
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_KEY);

    await service.restorePassword(decoded.email, password1);
    return res.status(200).send(RESPONSE.UPDATED);
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

export const checkPassword = async (req, res, next) => {
  const { oldPassword, token } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_KEY);
    let user = await service.findUser(decoded.email);
    if (!user) {
      return res.status(400).send(RESPONSE.USER.NOT_EXIST);
    }
    if (await compare(oldPassword, user.password)) {
      return res.status(200).send();
    } else {
      return res.status(404).send("Incorrect password");
    }
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

export const logout = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(404).send(RESPONSE.USER.NOT_FOUND);
    }

    res.clearCookie(REFRESH_TOKEN);

    return res.status(200).send();
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

export const getUser = async (req, res, next) => {
  const email = req.user.email;
  try {
    if (!req.user) {
      return res.status(404).send(RESPONSE.USER.NOT_FOUND);
    }

    const user = await service.findUser(email);

    if (!user) {
      return res.status(404).send(RESPONSE.USER.NOT_FOUND);
    }

    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const { users, count } = await service.findAllUsers();
    return res.status(200).json({ users, count });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

export const updateRole = async (req, res, next) => {
  const { email, role } = req.body;

  try {
    const user = await service.findUser(email);
    if (!user) {
      return res.status(404).send(RESPONSE.USER.NOT_FOUND);
    }
    await service.updateUserRole(user._id, role);
    return res.status(200).send();
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

export const updateUser = async (req, res, next) => {
  const { image, name, email } = req.body;
  const currentEmail = req.user.email;
  try {
    const user = await service.findUser(currentEmail);
    if (!user) {
      return res.status(404).send(RESPONSE.USER.NOT_FOUND);
    }
    await service.updateUser(user._id, name, email, image);
    res.status(200).json({ image, name, email });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

export const deleteUser = async (req, res, next) => {
  const { email } = req.user;
  try {
    const user = await service.findUser(email);
    if (!user) {
      return res.status(404).send(RESPONSE.USER.NOT_FOUND);
    }
    await service.deleteUser(user._id);
    res.status(200).send();
  } catch (err) {
    return res.status(500).send(err.message);
  }
};
