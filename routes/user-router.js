const router = require("express").Router();
const Users = require("../models/users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const registrationCred = require("../middleware/registrationCred");
const authenticate = require("../middleware/authenticate");
const {
  useableUserData,
  generateToken,
  accessTokenSecret,
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
    const token = generateToken(user, { expiresIn: "3d" });
    if (newUser.uid)
      res.status(200).json({
        message: "succesfully created user",
        token: token,
      });
  } catch {
    res.status(400).json({
      message: "Failed to make user",
    });
  }
});
router.post("/login", async (req, res) => {
  let { username, email, password } = req.body;
  try {
    const user = await Users.find({ $or: [{ username }, { email }] });
    const response = user.filter((i) => i.uid)[0];
    const accessToken = await generateToken(response, accessTokenSecret, {
      expiresIn: "1d",
    });
    const refreshToken = await generateToken(response, refreshTokenSecret, {
      expiresIn: "30d",
    });
    if (response.uid && bcrypt.compareSync(password, response.password)) {
      res.cookie("secret-cookie", refreshToken, { httpOnly: true });
      res.status(200).json({
        message: "Successfully logged in",
        user: useableUserData(response),
        accessToken: accessToken,
      });
    } else {
      res.status(401).json({
        message: "username or password are invalid ",
      });
    }
  } catch (e) {
    res.status(500).json({
      message: "An error occured login user in, try again later",
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
  } catch {
    res.status(400).json({ success: false, accessToken: "" });
  }
  // token is valid and we send an access token
  const user = await Users.findOne({ uid: payload.uid });
  if (!user) {
    res.status(400).json({ success: false, accessToken: "" });
  }
  const refreshToken = await generateToken(user, refreshTokenSecret, {
    expiresIn: "30d",
  });
  res.cookie("secret-cookie", refreshToken, { httpOnly: true });
  res.status(200).json({
    success: true,
    accessToken: generateToken(user, accessTokenSecret),
  });
});

module.exports = router;
