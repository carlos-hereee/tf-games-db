const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const lobbySchema = new Schema(
  {
    uid: { type: String, required: true, unique: true },
    inUse: { type: Boolean },
    gameName: { type: String },
    status: { type: String },
    time: { type: String },
    players: [{ type: String }],
  },
  { timestamps: true }
);

const Lobby = mongoose.model("lobby", lobbySchema);
module.exports = Lobby;
