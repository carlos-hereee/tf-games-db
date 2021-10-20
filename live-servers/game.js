const { v4: uuidv4 } = require("uuid");

const games = [];
const createGameInstance = (board, players) => {
  const game = {
    uid: uuidv4(),
    board,
    players,
    turn: "player1",
    turnCount: 0,
    status: "",
  };
  games.push(game);
  return { game };
};

module.exports = { createGameInstance };
