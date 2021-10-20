const { v4: uuidv4 } = require("uuid");

const emitMessage = (socket, player, message) =>
  socket.emit("receive-message", {
    id: uuidv4(),
    player,
    message: `${player?.nickname} ${message}`,
  });

const emitBroadcast = (socket, lobbyId, message) =>
  socket.broadcast.to(lobbyId).emit("receive-message", {
    id: uuidv4(),
    player: { nickname: "Admin", uuid: "silent-code" },
    message,
  });
// const emitGameData = (socket, game, lobby, opponent, player) =>
//   socket.emit("gameData", { game, lobby, opponent, player });
const emitGameStart = (socket, game) => socket.emit("game-start", game);
const emitBroadcastGameStart = (socket, lobbyId, game) =>
  socket.broadcast.to(lobbyId).emit("game-start", game);
module.exports = {
  emitMessage,
  emitBroadcast,
  // emitGameData,
  emitGameStart,
  emitBroadcastGameStart,
};
