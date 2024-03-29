const { resetGame } = require("../live-servers/game");
const { emitRematch, emitResetData } = require("../live-servers/socketEmit");
const { startGameTimer } = require("./timer");

const rematch = (s, { game, player }) => {
  const isPlayer1 = game.player1.uid === player.uid;
  if (isPlayer1) {
    game.player1.rematch = !game.player1.rematch;
  } else {
    game.player2.rematch = !game.player2.rematch;
  }
  if (game.player2.rematch && game.player1.rematch) {
    // send reset game to both player
    const { reset } = resetGame(game);
    startGameTimer(s, reset);
    emitResetData(s, reset);
  } else {
    emitRematch(s, game, isPlayer1);
  }
};

module.exports = { rematch };
