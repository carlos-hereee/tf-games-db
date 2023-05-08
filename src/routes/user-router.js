const router = require("express").Router();
const Users = require("../models/users");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const registrationCred = require("../middleware/registrationCred");
const authenticate = require("../middleware/authenticate");
const {
  useableUserData,
  generateAccessToken,
  generateRefreshToken,
} = require("../middleware/authFunction");
const validateCookie = require("../middleware/validateCookie");

// custom middleware
const validateUser = [authenticate, validateCookie];

const changeOnline = async (isOnline, _id) => {
  await Users.updateOne({ _id }, { $set: { isOnline } });
};

router.get("/", authenticate, async (req, res) => {
  res.status(200).json(useableUserData(req.user));
});
router.get("/:uid", validateUser, async (req, res) => {
  const { uid } = req.params;
  try {
    const user = await Users.findOne({ uid });
    if (user) {
      res.status(200).json({ message: useableUserData(user) });
    }
  } catch {
    res.status(404).json({
      message: "Couldn't find user with that id",
    });
  }
});
router.post("/register", registrationCred, async (req, res) => {
  let user = req.body;
  user.password = bcrypt.hashSync(user.password, 10);
  user.uid = uuidv4();
  user.nickname = user.username;
  user.isOnline = true;
  try {
    const newUser = await new Users(user).save();
    const refreshToken = generateRefreshToken(newUser);
    const accessToken = generateAccessToken(newUser);
    res.cookie("secret-cookie", refreshToken, { httpOnly: true });
    res.status(200).json({ user: useableUserData(newUser), accessToken });
  } catch (e) {
    res.status(400).json({ message: "Failed to make user" });
  }
});
router.post("/login", async (req, res) => {
  let { username, password } = req.body;
  try {
    const user = await Users.findOne({ username });
    if (bcrypt.compareSync(password, user.password)) {
      const refreshToken = generateRefreshToken(user);
      const accessToken = generateAccessToken(user);
      changeOnline(true, user._id);
      const data = await Users.findOne({ username });
      res.status(200).cookie("secret-cookie", refreshToken, { httpOnly: true });
      res.json({ user: useableUserData(data), accessToken: accessToken });
    } else {
      res.status(404).json({ message: "username or password are invalid" });
    }
  } catch {
    res.status(400).json({ message: "User does not exist" });
  }
});
router.post("/refresh-token", validateUser, async (req, res) => {
  const { user } = req;
  // token is valid and send an access token
  const refreshToken = generateRefreshToken(user);
  const accessToken = generateAccessToken(user);
  res.cookie("secret-cookie", refreshToken, { httpOnly: true }).status(200);
  res.json({ accessToken: accessToken, user: useableUserData(user) });
});
router.delete("/logout", validateUser, async (req, res) => {
  try {
    changeOnline(false, req.user._id);
    if (req.session) {
      req.session.destroy();
    }
    res.clearCookie("secret-cookie");
    res.status(202).json({ message: "successful logout" });
  } catch {
    res.status(400).json({ message: "error loggin out" });
  }
});

module.exports = router;
