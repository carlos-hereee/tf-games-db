const jwt = require("jsonwebtoken");
const { accessTokenSecret } = require("./usefulFunctions");

module.exports = async (req, res, next) => {
  const authorization = req.headers.authorization;
  if (!authorization) {
    // no authorization header
    res.status(400).json({ message: "you need a token authorization" });
  }
  try {
    const token = authorization.split(" ")[1];
    req.user = jwt.verify(token, accessTokenSecret);
    next();
  } catch (err) {
    // could not authenticate
    res.status(401).json({ message: "you shall not pass!" });
  }
};
