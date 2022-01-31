const { v4: uuidv4 } = require("uuid");

// send message to self
const emitMessage = (socket, player, message) =>
  socket.emit("receive-message", {
    id: uuidv4(),
    player,
    message: `${player?.nickname} ${message}`,
  });
// send message to others not self
const emitBroadcast = (socket, lobbyId, message) =>
  socket.broadcast.to(lobbyId).emit("receive-message", {
    id: uuidv4(),
    player: { nickname: "Admin", uid: "silent-code" },
    message,
  });
// send game data to client
const emitGameData = (socket, game, lobbyId) => {
  socket.emit("game-data", game);
  socket.broadcast.to(lobbyId).emit("game-data", game);
};
// send game data to self
const emitGameStart = (socket, game) => socket.emit("game-start", game);
// send game data others not to self
const emitBroadcastGameStart = (socket, game, lobbyId) =>
  socket.broadcast.to(lobbyId).emit("game-start", game);
// send game result to self
const emitGameResults = (socket, result) => socket.emit("game-results", result);
// send game result to others
const emitBroadcastGameResults = (socket, result, lobbyId) =>
  socket.broadcast.to(lobbyId).emit("game-results", result);
// send rematch notice to self
const emitRematchMessage = (socket, result) =>
  socket.emit("rematch-response", result);
// send rematch notice to others
const emitBroadcastRematchMessage = (socket, result, lobbyId) =>
  socket.broadcast.to(lobbyId).emit("rematch-response", result);
// send rematch notice to self
const emitResetGame = (socket, result) =>
  socket.emit("game-reset-response", result);
// send rematch notice to others
const emitBroadcastResetGame = (socket, result, lobbyId) =>
  socket.broadcast.to(lobbyId).emit("game-reset-response", result);

module.exports = {
  emitMessage,
  emitBroadcast,
  emitGameData,
  emitGameStart,
  emitBroadcastGameStart,
  emitGameResults,
  emitBroadcastGameResults,
  emitRematchMessage,
  emitBroadcastRematchMessage,
  emitResetGame,
  emitBroadcastResetGame,
};
