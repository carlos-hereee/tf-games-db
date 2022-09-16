const { updateTicTacToe } = require("../live-servers/game");
const { snakegame } = require("../live-servers/games/snakegame");
const { emitGameData, emitGameResults } = require("../live-servers/socketEmit");
const { clearGameTimer } = require("./timer");

const games = {
  tictactoe: updateTicTacToe,
  snakeGame: snakegame,
};

const gameUpdate = (s, { game, motion, player }) => {
  // updated the game board
  const { g } = games[game.gameName](s, game, motion, player);
  // check for win
  if (g) {
    if (g.gameOver) {
      clearGameTimer(s, game);
      emitGameResults(s, g.lobbyId, g.gameResults);
    }
    emitGameData(s, g);
  }
};
module.exports = { gameUpdate };
