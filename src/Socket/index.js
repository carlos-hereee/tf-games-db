const {
  findOpenQueue,
  findTicketWithPlayerId,
  createTicket,
  cancelTicket,
} = require("../live-servers/lobby");
const {
  findGame,
  updateGameboard,
  startGame,
  requestRematch,
  resetGame,
  removeGame,
} = require("../live-servers/game");
const {
  emitMessage,
  emitGameData,
  emitGameStartData,
  emitGameResults,
  emitRematchMessage,
  emitResetGame,
  emitTicketData,
  emitMessageLeft,
} = require("../live-servers/socketEmit.js");
const { clearLobbyTimer } = require("./timer");
const { newgame } = require("./newgame");

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

const socketManager = (sck) => {
  const playerId = sck.handshake.query.id;
  initialConnection(sck, playerId);
  sck.on("new-game", ({ player, gameName }) => newgame(sck, player, gameName));
  sck.on("cancel-ticket", ({ ticket, player }) => {
    cancelTicket(ticket);
    clearLobbyTimer(sck, player);
  });
  sck.on("player-leave", ({ player, game }) => {
    // reset game results
    emitGameResults(sck, game.lobbyId, "");
    sck.leave(game.lobbyId);
    // delete game
    removeGame(game);
    emitMessageLeft(sck, game, player);
  });
  sck.on("place-mark", ({ game, cell, player }) => {
    // updated the game board
    const { updatedGame, result } = updateGameboard(game, cell, player);
    emitGameData(sck, updatedGame);
    // check for win
    if (result === "win" || result === "draw") {
      emitGameResults(sck, game.lobbyId, result);
    }
  });
  sck.on("request-rematch", ({ game, isPlayer1 }) => {
    const { players } = requestRematch(game, isPlayer1);
    if (players.player2.rematch && players.player1.rematch) {
      const { reset } = resetGame(game);
      // send reset game to both player
      emitResetGame(sck, reset);
    } else {
      emitRematchMessage(sck, game, players, isPlayer1);
    }
  });
};

module.exports = { socketManager };
