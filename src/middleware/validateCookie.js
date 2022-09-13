const jwt = require("jsonwebtoken");
const Users = require("../models/users");
const { refreshTokenSecret } = require("./authFunction");

module.exports = async (req, res, next) => {
  const cookie = req.cookies["secret-cookie"];
  if (!cookie) {
    return res.status(400).json({ accessToken: "" });
  }
  let payload = jwt.verify(cookie, refreshTokenSecret);
  const user = await Users.findOne({
    $or: [{ username: payload.username }, { uid: payload.uid }],
  });
  if (!user) {
    return res.status(404).json({ message: "user not found" });
  } else {
    req.user = user;
    next();
  }
};
