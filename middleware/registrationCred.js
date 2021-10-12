const Users = require("../models/users");

module.exports = async (req, res, next) => {
  let { username, email } = req.body;
  try {
    const user = await Users.find({ $or: [{ username }, { email }] });
    if (user.filter((i) => i.uid).length) {
      res.status(400).json({
        status: "failed",
        code: 400,
        message: "A user already exists with that username",
      });
    } else {
      next();
    }
  } catch {
    res.status(500).json({
      status: "failed",
      code: 500,
      message:
        "An error occured checking if user already exists with that username",
    });
  }
};
