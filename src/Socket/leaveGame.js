const { removeGame } = require("../live-servers/game");
const { emitMessageLeft } = require("../live-servers/socketEmit");

const leaveGame = (s, { player, game }) => {
  const isPlayer1 = game.player1.uid === player.uid;
  const isPlayer2 = game.player2.uid === player.uid;
  // check if opponent left game
  if (isPlayer1 && game.player2.uid) {
    game.player1 = {};
  }
  if (isPlayer2 && game.player1.uid) {
    game.player2 = {};
  }
  if (!game.player1.uid && !game.player2.uid) {
    removeGame(game);
  }
  emitMessageLeft(s, game, player);
  s.leave(game.lobbyId);
};

module.exports = { leaveGame };
