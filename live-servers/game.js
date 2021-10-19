const Game = require("../models/game");
const { v4: uuidv4 } = require("uuid");
const boards = require("./boards");

const createGame = async ({ lobbyId, gameName }) => {
  try {
    const newGame = await new Game({
      lobbyId,
      gameName,
      uid: uuidv4(),
      gameLog: [],
      inUse: true,
      board: boards[gameName],
    }).save();
    return { game: newGame };
  } catch {
    return { error: "Servers are down try again later" };
  }
};

module.exports = { createGame };
