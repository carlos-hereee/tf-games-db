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
// send game data to self
const emitGameData = (socket, game) => socket.emit("game-data", game);
// send game data to self
const emitGameStart = (socket, game) => socket.emit("game-start", game);
// send game data others not to self
const emitBroadcastGameData = (socket, game, lobbyId) =>
  socket.broadcast.to(lobbyId).emit("game-data", game);
// send game data others not to self
const emitBroadcastGameStart = (socket, game, lobbyId) =>
  socket.broadcast.to(lobbyId).emit("game-start", game);

module.exports = {
  emitMessage,
  emitBroadcast,
  emitGameData,
  emitGameStart,
  emitBroadcastGameData,
  emitBroadcastGameStart,
};
