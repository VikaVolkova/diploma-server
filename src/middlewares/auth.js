import jwt from 'jsonwebtoken';
import { ACCESS_TOKEN, RESPONSE_MESSAGES } from '../helpers/index.js';

export const auth = (roles) => (req, res, next) => {
  const token =
    req.body.accessToken ||
    req.body.token ||
    req.query.token ||
    req.headers['x-access-token'];

  try {
    const payload = jwt.verify(token, ACCESS_TOKEN);
    if (roles.length && !roles.includes(payload.role)) {
      return res.status(403).send(RESPONSE_MESSAGES.ACCESS_DENIED);
    }

    req.user = payload;
  } catch (err) {
    err.status = 401;
    return next(err);
  }
  return next();
};
