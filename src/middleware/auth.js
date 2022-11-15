const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const token = req.body.token || req.header("x-token");
  if (!token) return res.status(401).send("User is unauthorized");

  try {
    const payload = jwt.verify(token, process.env.ACCESS_KEY);
    req.user = payload;
    next();
  } catch (err) {
    res.status(400).send("Invalid token");
  }
};

module.exports = auth;
