const { updateTicTacToe } = require("../live-servers/game");
const { snakegame } = require("../live-servers/games/snakegame");
const { emitGameData, emitGameResults } = require("../live-servers/socketEmit");

const games = {
  tictactoe: updateTicTacToe,
  snakeGame: snakegame,
};

const gameUpdate = (s, { game, motion, player }) => {
  // updated the game board
  games[game.gameName](s, game, motion, player);
  // emitGameData(s, updatedGame);
  // check for win
  // if (result === "win" || result === "draw") {
  //   emitGameResults(s, game.lobbyId, result);
  // }
};
module.exports = { gameUpdate };
