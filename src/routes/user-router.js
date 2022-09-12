const router = require("express").Router();
const Users = require("../models/users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const registrationCred = require("../middleware/registrationCred");
const authenticate = require("../middleware/authenticate");
const {
  useableUserData,
  generateAccessToken,
  generateRefreshToken,
  logout,
  refreshTokenSecret,
} = require("../middleware/authFunction");

router.get("/", authenticate, async (req, res) => {
  const { uid, username, email } = req.user;
  // get users data
  try {
    const user = await Users.findOne({
      $or: [{ uid }, { username }, { email }],
    });
    res.status(200).json({ message: useableUserData(user) });
  } catch {
    // user not in database; needs to create an account
    res.status(404).json({ message: "user not found" });
  }
});
router.get("/:uid", authenticate, async (req, res) => {
  const { uid } = req.params;
  try {
    const user = await Users.find({ uid });
    console.log("uid", user);
    if (user[0].uid) {
      res.status(200).json({
        message: useableUserData(user[0]),
      });
    }
  } catch {
    res.status(404).json({
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
    const user = useableUserData(newUser);
    const refreshToken = generateRefreshToken(newUser);
    const accessToken = generateAccessToken(newUser);
    res.cookie("secret-cookie", refreshToken, { httpOnly: true });
    return res.status(200).json({ user, accessToken: accessToken });
  } catch (e) {
    res.status(400).json({ message: "Failed to make user" });
  }
});
router.post("/login", async (req, res) => {
  let { username, password } = req.body;
  const user = await Users.findOne({ username });
  try {
    if (bcrypt.compareSync(password, user.password)) {
      const refreshToken = generateRefreshToken(user);
      const accessToken = generateAccessToken(user);
      res.cookie("secret-cookie", refreshToken, { httpOnly: true });
      return res.status(200).json({
        user: useableUserData(user),
        accessToken: accessToken,
      });
    } else {
      return res.status(404).json({
        message: "username or password are invalid",
      });
    }
  } catch {
    return res.status(400).json({ message: "User does not exist" });
  }
});

router.post("/refresh-token", async (req, res) => {
  const token = req.cookies["secret-cookie"];
  if (!token) {
    // no cookie
    return res.status(400).json({ accessToken: "" });
  }
  let payload = jwt.verify(token, refreshTokenSecret);
  const user = await Users.findOne({
    $or: [{ username: payload.username }, { uid: payload.uid }],
  });
  if (!user) {
    return res.status(400).json({ accessToken: "" });
  }
  // token is valid and we send an access token
  const refreshToken = generateRefreshToken(user);
  const accessToken = generateAccessToken(user);
  res.cookie("secret-cookie", refreshToken, { httpOnly: true });
  res.status(200).json({ accessToken: accessToken, user: { uid: user.uid } });
});

module.exports = router;
