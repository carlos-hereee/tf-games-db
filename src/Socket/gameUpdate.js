const { updateTicTacToe, updateSnakeGame } = require("../live-servers/game");
const { emitGameData, emitGameResults } = require("../live-servers/socketEmit");

const games = {
  tictactoe: updateTicTacToe,
  snakeGame: updateSnakeGame,
};

const gameUpdate = (s, game, motion, player) => {
  // updated the game board
  const { updatedGame } = games[game.gameName](s, game, motion, player);
  emitGameData(s, updatedGame);
  // check for win
  // if (result === "win" || result === "draw") {
  //   emitGameResults(s, game.lobbyId, result);
  // }
};
module.exports = { gameUpdate };
