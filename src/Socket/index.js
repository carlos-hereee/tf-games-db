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
const { gameUpdate } = require("./gameUpdate");

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
  s.on("new-game", ({ player, gameName }) => newgame(s, player, gameName));
  s.on("game-update", ({ game, motion, player }) =>
    gameUpdate(s, game, motion, player)
  );
  s.on("cancel-ticket", ({ ticket, player }) => {
    cancelTicket(ticket);
    clearLobbyTimer(s, player);
  });
  s.on("player-leave", ({ player, game }) => {
    // reset game results
    emitGameResults(s, game.lobbyId, "");
    s.leave(game.lobbyId);
    // delete game
    removeGame(game);
    emitMessageLeft(s, game, player);
  });

  s.on("request-rematch", ({ game, isPlayer1 }) => {
    const { players } = requestRematch(game, isPlayer1);
    if (players.player2.rematch && players.player1.rematch) {
      const { reset } = resetGame(game);
      // send reset game to both player
      emitResetGame(s, reset);
    } else {
      emitRematchMessage(s, game, players, isPlayer1);
    }
  });
};

module.exports = { socketManager };
