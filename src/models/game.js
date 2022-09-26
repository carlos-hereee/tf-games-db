const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const gameSchema = new Schema(
  {
    uid: { type: String, required: true, unique: true },
    isUse: { type: Boolean },
    gameName: { type: String },
    grid: [
      {
        cell: {
          x: { type: Number },
          y: { type: Number },
          hasContent: { type: Boolean },
          content: { type: String },
        },
      },
    ],
    gameLog: [
      { log: { type: String }, id: { type: String }, user: { type: String } },
    ],
    lobbyId: { type: String },
  },
  { timestamps: true }
);

const Game = mongoose.model("game", gameSchema);
module.exports = Game;
