const router = require("express").Router();
const Users = require("../models/users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const registrationCred = require("../middleware/registrationCred");
const authenticate = require("../middleware/authenticate");

router.get("/", async (req, res) => {
  res
    .status(200)
    .json({ status: "success", message: "made it to users router" });
});
router.get("/:uid", authenticate, async (req, res) => {
  const { uid } = req.params;
  try {
    const user = await Users.find({ uid });
    const response = {
      username: user[0].username,
      uid: user[0].uid,
    };
    if (user[0].uid) {
      res.status(200).json({
        status: "success",
        code: 200,
        message: response,
      });
    }
  } catch {
    res.status(404).json({
      status: "failed",
      code: 404,
      message: "Couldn't find user with that id",
    });
  }
});
// make a new user
router.post("/register", registrationCred, async (req, res) => {
  let user = req.body;
  user.password = bcrypt.hashSync(user.password, 10);
  user.uid = uuidv4();

  try {
    const newUser = await new Users(user).save();
    const token = generateToken(user);
    if (newUser.uid)
      res.status(200).json({
        status: "success",
        code: 200,
        message: "succesfully created user",
        token: token,
      });
  } catch {
    res.status(400).json({
      status: "failed",
      code: 400,
      message: "Failed to make user",
    });
  }
});
router.post("/login", async (req, res) => {
  let { username, email, password } = req.body;
  try {
    const user = await Users.find({ $or: [{ username }, { email }] });
    const response = user.filter((i) => i.uid)[0];
    if (response.uid && bcrypt.compareSync(password, response.password)) {
      const token = await generateToken(response);
      res.status(200).json({
        message: "Successfully logged in",
        status: "success",
        code: 200,
        token: token,
      });
    } else {
      res.status(401).json({
        status: "failed",
        code: 401,
        message: "username or password are invalid ",
      });
    }
  } catch {
    res.status(500).json({
      status: "failed",
      code: 500,
      message: "An error occured login user in, try again later",
    });
  }
});

// generate token @login
const generateToken = async (user) => {
  return jwt.sign(
    { username: user.username || user.email },
    process.env.JWT_SECRET || "keep it secret, keep it safe",
    {
      expiresIn: "3d",
    }
  );
};
module.exports = router;
