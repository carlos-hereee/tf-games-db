const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const toLower = (str) => str.toLowerCase();

const userSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    uid: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, set: toLower },
    elo: { type: Number },
    avatarSrc: { type: String },
    nickname: { type: String },
  },
  { timestamps: true }
);

const Users = mongoose.model("Users", userSchema);
module.exports = Users;
