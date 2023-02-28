import { compare } from 'bcrypt';
import {
  userSchemaRegister,
  userSchemaLogin,
  userSchemaForgotPassword,
  userSchemaRestorePassword,
} from '../validation/user.js';
import {
  sendEmail,
  RESPONSE_MESSAGES,
  RESTORE_PASSWORD_URL,
  REFRESH_TOKEN,
  ACCESS_TOKEN,
} from '../helpers/index.js';
import jwt from 'jsonwebtoken';

import * as service from './user.service.js';
import { getUserDTO } from '../dto/user.dto.js';
import { getDataForRegister } from '../helpers/helpers.js';

const makeTokenPayload = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  image: user.image,
  role: user.role,
  isBlocked: user.isBlocked,
});

const makeAccessToken = (payload) => {
  const accessTokenLife = '1h';

  return jwt.sign(payload, ACCESS_TOKEN, {
    expiresIn: accessTokenLife,
  });
};

const makeRefreshToken = (payload) => {
  const refreshTokenLife = '10d';

  return jwt.sign(payload, REFRESH_TOKEN, {
    expiresIn: refreshTokenLife,
  });
};

export const getAccessTokenByRefreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res.status(404).send(RESPONSE_MESSAGES.USER.NO_TOKEN);
    }

    const decoded = jwt.verify(refreshToken, REFRESH_TOKEN);

    const payload = makeTokenPayload(decoded);

    const accessToken = makeAccessToken(payload);

    res.json({ accessToken });
  } catch (err) {
    return next(err);
  }
};

export const register = async (req, res, next) => {
  const data = getDataForRegister(req.body);

  const { error } = userSchemaRegister.validate(data);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const user = await service.findUser(data.email);
    if (user) return res.status(400).send(RESPONSE_MESSAGES.USER.EMAIL_EXISTS);

    await service.register(data);

    res.status(201).send();
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

export const login = async (req, res, next) => {
  const { email, password, googleUser } = req.body;

  const { error } = userSchemaLogin.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const user = await service.findUser(email);

    if (!user) {
      return res.status(400).send(RESPONSE_MESSAGES.USER.NOT_EXIST);
    }

    const userPassword = user.password;
    const userData = getUserDTO(user);

    if (!googleUser ? compare(password, userPassword) : true) {
      const payload = makeTokenPayload(user);
      const accessToken = makeAccessToken(payload);
      const refreshToken = makeRefreshToken(payload);

      res.cookie(REFRESH_TOKEN, refreshToken, {
        httpOnly: true,
        SameSite: 'lax',
      });

      return res.status(200).json({ userData, accessToken });
    } else {
      return res.status(404).send(RESPONSE_MESSAGES.USER.INVALID_PASSWORD);
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
      return res.status(400).send(RESPONSE_MESSAGES.USER.NOT_EXIST);
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
    return res.status(404).send(RESPONSE_MESSAGES.USER.NOT_FOUND);
  }

  if (password1 !== password2) {
    return res.status(400).send(RESPONSE_MESSAGES.USER.NOT_EQUAL_PASS);
  }

  try {
    const decoded = jwt.verify(token, ACCESS_TOKEN);

    await service.restorePassword(decoded.email, password1);

    return res.status(200).send(RESPONSE_MESSAGES.UPDATED);
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

export const checkPassword = async (req, res, next) => {
  const { oldPassword, token } = req.body;
  try {
    const decoded = jwt.verify(token, ACCESS_TOKEN);

    let user = await service.findUser(decoded.email);
    if (!user) {
      return res.status(400).send(RESPONSE_MESSAGES.USER.NOT_EXIST);
    }

    if (await compare(oldPassword, user.password)) {
      return res.status(200).send();
    } else {
      return res.status(404).send(RESPONSE_MESSAGES.USER.INVALID_PASSWORD);
    }
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

export const logout = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(404).send(RESPONSE_MESSAGES.USER.NOT_FOUND);
    }

    res.clearCookie(REFRESH_TOKEN);

    return res.status(200).send();
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

export const getUser = async (req, res, next) => {
  const email = req.user?.email;
  try {
    if (!req.user) {
      return res.status(404).send(RESPONSE_MESSAGES.USER.NOT_FOUND);
    }

    const user = await service.findUser(email);

    if (!user) {
      return res.status(404).send(RESPONSE_MESSAGES.USER.NOT_FOUND);
    }

    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    let { users, count } = await service.findAllUsers();

    users = users.map((user) => getUserDTO(user));

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
      return res.status(404).send(RESPONSE_MESSAGES.USER.NOT_FOUND);
    }

    await service.updateUserRole(user._id, role);
    const { users } = await service.findAllUsers();

    res.status(200).json(users);
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
      return res.status(404).send(RESPONSE_MESSAGES.USER.NOT_FOUND);
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
      return res.status(404).send(RESPONSE_MESSAGES.USER.NOT_FOUND);
    }

    await service.deleteUser(user._id);

    res.status(200).send();
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

export const toggleBlockUser = async (req, res, next) => {
  const { email, isBlocked } = req.body;
  try {
    const user = await service.findUser(email);
    if (!user) {
      return res.status(404).send(RESPONSE_MESSAGES.USER.NOT_FOUND);
    }

    await service.toggleBlockUser(user._id, isBlocked);
    const { users } = await service.findAllUsers();

    res.status(200).json({ users });
  } catch (error) {
    return res.status(500).send(err.message);
  }
};
