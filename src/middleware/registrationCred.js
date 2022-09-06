const Users = require("../models/users");

module.exports = async (req, res, next) => {
  let { username } = req.body;
  try {
    const user = await Users.find({ $or: [{ username }, { email: username }] });
    if (user.filter((i) => i.uid).length) {
      res.status(400).json({
        message: "A user already exists with that username",
      });
    } else {
      next();
    }
  } catch {}
};
