const { v4: uuidv4 } = require("uuid");

// send message to self
const emitMessage = (socket, player, message, roomId) => {
  socket.emit("receive-message", {
    id: uuidv4(),
    player,
    message: `${player?.nickname} ${message}`,
  });
  socket.broadcast.to(roomId).emit("receive-message", {
    id: uuidv4(),
    player: { nickname: "Admin", uid: "silent-code" },
    message,
  });
};

// send game data to client
const emitGameData = (socket, game) => {
  socket.emit("game-data", game);
  socket.broadcast.to(game.lobbyId).emit("game-data", game);
};

// send game result
const emitGameResults = (socket, roomId, result) => {
  socket.emit("game-results", { result });
  // broadcast the opposite message
  socket.broadcast.to(roomId).emit("game-results", {
    result: result === "win" ? "lose" : result,
  });
};

// send rematch
const emitRematchMessage = (socket, game, players, isPlayer1) => {
  socket.emit("rematch-response", {
    message: `${
      isPlayer1 ? players.player1.nickname : players.player2.nickname
    } ${players.player1.rematch ? "requested" : "canceled"} rematch`,
    players,
  });
  socket.broadcast.to(game.lobbyId).emit("rematch-response", {
    message: `${
      isPlayer1 ? players.player1.nickname : players.player2.nickname
    } ${players.player1.rematch ? "requested" : "canceled"} rematch`,
    players,
  });
};
// send rematch
const emitMessageLeft = (socket, data, player) => {
  socket.broadcast.to(data.lobbyId).emit("left-response", {
    message: `${player.nickname} left`,
  });
};
// send rematch notice to self
const emitResetGame = (socket, game) => {
  socket.emit("game-reset-response", game);
  socket.broadcast.to(game.lobbyId).emit("game-reset-response", game);
};
const emitTicketData = (socket, ticket) => {
  socket.emit("ticket-data", ticket);
};
const emitClockLobbyData = (socket, clockData) => {
  socket.emit("clock-lobby-data", clockData);
};
module.exports = {
  emitMessage,
  emitGameData,
  emitGameResults,
  emitRematchMessage,
  emitResetGame,
  emitTicketData,
  emitMessageLeft,
  emitClockLobbyData,
};
