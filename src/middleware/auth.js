import jwt from "jsonwebtoken";
import { ACCESS_KEY, RESPONSE_MESSAGES } from "../helpers/index.js";

export const auth = (roles) => (req, res, next) => {
  const token =
    req.body.accessToken ||
    req.body.token ||
    req.query.token ||
    req.headers["x-access-token"];
  if (!token) return res.status(403).send(RESPONSE_MESSAGES.TOKEN_REQUIRED);

  try {
    const payload = jwt.verify(token, ACCESS_KEY);
    if (roles.length && !roles.includes(payload.role)) {
      return res.status(403).send(RESPONSE_MESSAGES.ACCESS_DENIED);
    }

    req.user = payload;
  } catch (err) {
    res.status(400).send(RESPONSE_MESSAGES.INVALID_TOKEN);
  }
  return next();
};
