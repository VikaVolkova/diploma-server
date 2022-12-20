import jwt from "jsonwebtoken";
import { HEADERS_TOKEN_NAME } from "../helpers/constants.js";
import { RESPONSE } from "../helpers/response.js";

export const auth = (roles) => (req, res, next) => {
  const token =
    req.body.accessToken ||
    req.body.token ||
    req.query.token ||
    req.headers["x-access-token"];
  if (!token) return res.status(403).send(RESPONSE.TOKEN_REQUIRED);

  try {
    const payload = jwt.verify(token, process.env.ACCESS_KEY);
    if (roles.length && !roles.includes(payload.role)) {
      return res.status(403).send(RESPONSE.ACCESS_DENIED);
    }

    req.user = payload;
  } catch (err) {
    res.status(400).send(RESPONSE.INVALID_TOKEN);
  }
  return next();
};
