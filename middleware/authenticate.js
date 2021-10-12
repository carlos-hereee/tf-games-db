const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.headers.authorization;
  if (token) {
    jwt.verify(
      token,
      process.env.JWT_SECRET || "keep it secret, keep it safe",
      (err, decodedToken) => {
        if (err) {
          console.log("err", err);
          res.status(401).json({
            status: "failed",
            code: 401,
            message: "you shall not pass!",
          });
        } else {
          req.user = { username: decodedToken.username };
          next();
        }
      }
    );
  } else {
    res.status(400).json({
      status: "failed",
      code: 400,
      message: "you need a token authorization",
    });
  }
};
