const { v4: uuidv4 } = require("uuid");

const emitMessage = (socket, player, message) =>
  socket.emit("message", {
    id: uuidv4(),
    player,
    message: `${player?.nickname} ${message}`,
  });

const emitBroadcast = (socket, { lobbyId }, message) =>
  socket.broadcast.to(lobbyId).emit("message", {
    id: uuidv4(),
    user: "Admin",
    message,
  });
const emitGameData = (socket, game, lobby, opponent, player) =>
  socket.emit("gameData", { game, lobby, opponent, player });

module.exports = {
  emitMessage,
  emitBroadcast,
  emitGameData,
};
