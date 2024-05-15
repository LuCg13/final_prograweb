const jwt = require("jsonwebtoken");

exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, "FinProWEB2024*", (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};
