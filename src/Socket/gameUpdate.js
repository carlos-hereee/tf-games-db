const { snakegame } = require("../live-servers/games/snakegame");
const { tictactoe } = require("../live-servers/games/tictactoe");
const {
  emitGameData,
  emitInitialGameResults,
} = require("../live-servers/socketEmit");
const { clearGameTimer } = require("./timer");

const games = {
  tictactoe: tictactoe,
  snakeGame: snakegame,
};

const gameUpdate = (s, { game, inputDirection, player }) => {
  // updated the game grid
  games[game.gameName](s, game, inputDirection, player);
  // check for win
  if (game.gameOver) {
    clearGameTimer(s, game);
    emitInitialGameResults(s, game);
  }
  emitGameData(s, game);
};
module.exports = { gameUpdate };
