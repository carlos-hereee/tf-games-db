const { v4: uuidv4 } = require("uuid");

// send message to self
const emitMessage = (socket, player, message) =>
  socket.emit("receive-message", {
    id: uuidv4(),
    player,
    message: `${player?.nickname} ${message}`,
  });
// send message to others not self
const emitBroadcast = (socket, roomId, message) =>
  socket.broadcast.to(roomId).emit("receive-message", {
    id: uuidv4(),
    player: { nickname: "Admin", uid: "silent-code" },
    message,
  });
// send game data to client
const emitGameData = (socket, game, roomId) => {
  socket.emit("game-data", game);
  socket.broadcast.to(roomId).emit("game-data", game);
};
// send game data to self
const emitGameStart = (socket, game) => socket.emit("game-start", game);
// send game data others not to self
const emitBroadcastGameStart = (socket, game, roomId) =>
  socket.broadcast.to(roomId).emit("game-start", game);
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
    } requested rematch`,
    players,
  });
  socket.broadcast.to(game.lobbyId).emit("rematch-response", {
    message: `${
      isPlayer1 ? players.player1.nickname : players.player2.nickname
    } requested rematch`,
    players,
  });
};
// send rematch notice to self
const emitResetGame = (socket, game) => {
  socket.emit("game-reset-response", game);
  socket.broadcast.to(game.lobbyId).emit("game-reset-response", game);
};

module.exports = {
  emitMessage,
  emitBroadcast,
  emitGameData,
  emitGameStart,
  emitBroadcastGameStart,
  emitGameResults,
  emitRematchMessage,
  emitResetGame,
};
