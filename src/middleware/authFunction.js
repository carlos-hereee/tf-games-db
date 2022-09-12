const jwt = require("jsonwebtoken");

const useableUserData = (user) => {
  return {
    username: user.username,
    elo: user.elo,
    uid: user.uid,
  };
};
// generate token
const generateToken = (user, secret, length) => {
  return jwt.sign({ username: user.username, uid: user.uid }, secret, length);
};
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;

// generate tokens
const generateAccessToken = (user) => {
  return generateToken(user, accessTokenSecret, {
    expiresIn: "1d",
  });
};
const generateRefreshToken = (user) => {
  return generateToken(user, refreshTokenSecret, {
    expiresIn: "30d",
  });
};
const logout = async (_, res) => {
  try {
    res.clearCookie("secret-cookie");
    res.status(200).redirect("/login");
  } catch (e) {
    console.log("e", e);
    return { success: false };
  }
};

module.exports = {
  useableUserData,
  generateAccessToken,
  generateRefreshToken,
  logout,
  refreshTokenSecret,
  accessTokenSecret,
};
