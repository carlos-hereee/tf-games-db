const {
  findTicketWithPlayerId,
  cancelTicket,
} = require("../live-servers/lobby");
const { findGame, removeGame } = require("../live-servers/game");
const {
  emitMessage,
  emitGameData,
  emitInitialGameResults,
  emitTicketData,
  emitMessageLeft,
} = require("../live-servers/socketEmit.js");
const { newgame } = require("./newgame");
const { gameUpdate } = require("./gameUpdate");
const { rematch } = require("./rematch");

const initialConnection = (socket, playerId) => {
  if (playerId) {
    socket.join(playerId);
    console.log(`connection made on socket id : ${playerId}`);
    const { ticket } = findTicketWithPlayerId(playerId);
    if (ticket?.createdBy?.uid) {
      emitTicketData(socket, ticket);
      emitMessage(socket, ticket.createdBy, "Already in the queue");
    }
    // check if player is already in a game
    const { game } = findGame(playerId);
    if (game.lobbyId) {
      // send player to game
      socket.join(game.lobbyId);
      emitGameData(socket, game);
    }
  }
};

const socketManager = (s) => {
  const playerId = s.handshake.query.id;
  initialConnection(s, playerId);
  s.on("game-new", (data) => newgame(s, data));
  s.on("game-update", (data) => gameUpdate(s, data));
  s.on("cancel-ticket", (data) => cancelTicket(s, data));
  s.on("rematch", (data) => rematch(s, data));
  s.on("player-leave", ({ player, game }) => {
    // reset game results
    emitInitialGameResults(s, game.lobbyId, "");
    s.leave(game.lobbyId);
    // delete game
    removeGame(game);
    emitMessageLeft(s, game, player);
  });
};

module.exports = { socketManager };
