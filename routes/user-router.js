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
  refreshTokenSecret,
} = require("../usefulFunctions");

router.get("/", async (req, res) => {
  res
    .status(200)
    .json({ status: "success", message: "made it to users router" });
});
router.get("/:uid", authenticate, async (req, res) => {
  const { uid } = req.params;
  try {
    const user = await Users.find({ uid });
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
    if (newUser.uid) {
      const refreshToken = generateRefreshToken(newUser);
      const accessToken = generateRefreshToken(newUser);
      res.cookie("secret-cookie", refreshToken, { httpOnly: true });
      res.status(200).json({
        user: useableUserData(response),
        accessToken: accessToken,
      });
    }
  } catch {
    res.status(400).json({ message: "Failed to make user" });
  }
});
router.post("/login", async (req, res) => {
  let { username, email, password } = req.body;
  try {
    const user = await Users.find({ $or: [{ username }, { email }] });
    const response = user.filter((i) => i.uid)[0];
    if (response.uid && bcrypt.compareSync(password, response.password)) {
      const refreshToken = generateRefreshToken(response);
      const accessToken = generateRefreshToken(response);
      res.cookie("secret-cookie", refreshToken, { httpOnly: true });
      res.status(200).json({
        user: useableUserData(response),
        accessToken: accessToken,
      });
    } else {
      res.status(401).json({ message: "username or password are invalid " });
    }
  } catch (e) {
    res.status(500).json({
      message: "couldn't login user in, try again later",
    });
  }
});
router.post("/refresh-token", async (req, res) => {
  const token = req.cookies["secret-cookie"];
  let payload = null;
  if (!token) {
    // no cookie
    res.status(400).json({ success: false, accessToken: "" });
  }
  try {
    payload = jwt.verify(token, refreshTokenSecret);
    const user = await Users.find({ uid });
    if (!user) {
      res.status(400).json({ success: false, accessToken: "" });
    }
    // token is valid and we send an access token
    const refreshToken = generateRefreshToken(user);
    const accessToken = generateRefreshToken(user);
    res.cookie("secret-cookie", refreshToken, { httpOnly: true });
    res.status(200).json({ accessToken: accessToken });
  } catch {
    res.status(400).json({ success: false, accessToken: "" });
  }
});

module.exports = router;
