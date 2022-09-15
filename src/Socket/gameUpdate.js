const { updateTicTacToe } = require("../live-servers/game");
const { snakegame } = require("../live-servers/games/snakegame");
const { emitGameData, emitGameResults } = require("../live-servers/socketEmit");

const games = {
  tictactoe: updateTicTacToe,
  snakeGame: snakegame,
};

const gameUpdate = (s, { game, motion, player }) => {
  // updated the game board
  const { g } = games[game.gameName](s, game, motion, player);
  // check for win
  console.log("g.gameOver", g.gameOver);
  if (g.gameOver) {
    emitGameResults(s, g.lobbyId, g.gameResults);
  }
  emitGameData(s, g);
};
module.exports = { gameUpdate };
