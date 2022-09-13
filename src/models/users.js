const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const toLower = (str) => str.toLowerCase();

const userSchema = new Schema(
  {
    uid: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, set: toLower },
    avatarSrc: { type: String },
    nickname: { type: String },
    isOnline: { type: Boolean },
    elo: { type: Number },
  },
  { timestamps: true }
);

const Users = mongoose.model("Users", userSchema);
module.exports = Users;
