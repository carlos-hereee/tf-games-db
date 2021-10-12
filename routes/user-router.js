const router = require("express").Router();
const Users = require("../models/users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const registrationCred = require("../middleware/registrationCred");

router.get("/", async (req, res) => {
  res
    .status(200)
    .json({ status: "success", message: "made it to users router" });
});
router.get("/:uid", async (req, res) => {
  const { uid } = req.params;
  try {
    const user = await Users.findById(uid);
    res.status(200).send(user);
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
    if (user.uid && bcrypt.compareSync(password, user.password)) {
      const token = generateToken(user);
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
