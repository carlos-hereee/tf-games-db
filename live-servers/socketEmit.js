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

// send rematch notice to self
const emitRematchMessage = (socket, result) =>
  socket.emit("rematch-response", result);
// send rematch notice to others
const emitBroadcastRematchMessage = (socket, result, roomId) =>
  socket.broadcast.to(roomId).emit("rematch-response", result);
// send rematch notice to self
const emitResetGame = (socket, result) =>
  socket.emit("game-reset-response", result);
// send rematch notice to others
const emitBroadcastResetGame = (socket, result, roomId) =>
  socket.broadcast.to(roomId).emit("game-reset-response", result);

module.exports = {
  emitMessage,
  emitBroadcast,
  emitGameData,
  emitGameStart,
  emitBroadcastGameStart,
  emitGameResults,
  emitRematchMessage,
  emitBroadcastRematchMessage,
  emitResetGame,
  emitBroadcastResetGame,
};
