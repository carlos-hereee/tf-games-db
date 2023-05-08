const { findTicketWithPlayerId, cancelTicket } = require("../live-servers/lobby");
const { findGame } = require("../live-servers/game");
const {
  emitMessage,
  emitGameData,
  emitTicketData,
} = require("../live-servers/socketEmit.js");
const { newgame } = require("./newgame");
const { gameUpdate } = require("./gameUpdate");
const { rematch } = require("./rematch");
const { leaveGame } = require("./leaveGame");

const initialConnection = (socket, playerId) => {
  if (playerId) {
    socket.join(playerId);
    if (process.env.NODE_ENV === "development") {
      console.log(`connection made on socket id : ${playerId}`);
    }
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

const socketManager = (socket) => {
  const playerId = socket.handshake.query.uid;
  console.log("playerId", playerId);
  playerId && initialConnection(socket, playerId);
  socket.on("game-new", (data) => newgame(socket, data));
  socket.on("game-update", (data) => gameUpdate(socket, data));
  socket.on("cancel-ticket", (data) => cancelTicket(socket, data));
  socket.on("rematch", (data) => rematch(socket, data));
  socket.on("game-leave", (data) => leaveGame(socket, data));
};

module.exports = { socketManager };
