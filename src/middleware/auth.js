const jwt = require("jsonwebtoken");

const roles = {
  user: "USER",
  manager: "MANAGER",
  admin: "ADMIN",
};

const auth = (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];
  if (!token)
    return res.status(403).send("A token is required for authentication");

  try {
    const payload = jwt.verify(token, process.env.ACCESS_KEY);
    if (roles.length && !roles.includes(decoded.user_role)) {
      return res.status(403).send("No permissions");
    }

    req.user = payload;
    next();
  } catch (err) {
    res.status(400).send("Invalid token");
  }
};

module.exports = auth;
