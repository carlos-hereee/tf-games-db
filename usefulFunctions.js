const jwt = require("jsonwebtoken");
const useableUserData = (user) => {
  return {
    username: user.username,
    elo: user.elo,
    uid: user.uid,
  };
};
// generate token
const generateToken = async (user, secret, length) => {
  return jwt.sign({ username: user.username, uid: user.uid }, secret, length);
};
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;

module.exports = {
  useableUserData,
  generateToken,
  accessTokenSecret,
  refreshTokenSecret,
};
