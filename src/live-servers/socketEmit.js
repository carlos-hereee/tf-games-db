const { v4: uuidv4 } = require("uuid");
const { str, inverseStr } = require("./messageConfig");

// send message to self
const emitMessage = (s, player, message, roomId) => {
  s.emit("receive-message", {
    id: uuidv4(),
    player,
    message: `${player?.nickname} ${message}`,
  });
  s.broadcast.to(roomId).emit("receive-message", {
    id: uuidv4(),
    player: { nickname: "Admin", uid: "silent-code" },
    message,
  });
};
// send game data to client
const emitGameData = (s, game) => {
  s.emit("game-data", game);
  s.broadcast.to(game.lobbyId).emit("game-data", game);
};
// send game data to client
const emitGameStartData = (s, game) => {
  s.emit("game-start", game);
  s.broadcast.to(game.lobbyId).emit("game-start", game);
};
// send game result
const emitGameResults = (s, game) => {
  const player = {
    leftGame: false,
    rematch: false,
    message: str[game.gameResult].message,
    title: str[game.gameResult].title,
    result: game.gameResult,
  };
  const opponent = {
    ...player,
    message: str[inverseStr[game.gameResult]].message,
    title: str[inverseStr[game.gameResult]].title,
    result: str[inverseStr[game.gameResult]],
  };
  s.emit("game-results", { result: player });
  // broadcast the opposite message
  s.broadcast.to(game.lobbyId).emit("game-results", { result: opponent });
};
// send rematch
const emitRematchMessage = (s, game, players, isPlayer1) => {
  s.emit("rematch-response", {
    message: `${
      isPlayer1 ? players.player1.nickname : players.player2.nickname
    } ${players.player1.rematch ? "requested" : "canceled"} rematch`,
    players,
  });
  s.broadcast.to(game.lobbyId).emit("rematch-response", {
    message: `${
      isPlayer1 ? players.player1.nickname : players.player2.nickname
    } ${players.player1.rematch ? "requested" : "canceled"} rematch`,
    players,
  });
};
// send rematch
const emitMessageLeft = (s, data, player) => {
  s.emit("player-left", { show: false });
  s.broadcast.to(data.lobbyId).emit("left-response", {
    message: `${player.nickname} left`,
  });
};
// send rematch notice to self
const emitResetGame = (s, game) => {
  s.emit("game-reset-response", game);
  s.broadcast.to(game.lobbyId).emit("game-reset-response", game);
};
const emitTicketData = (s, ticket) => {
  s.emit("ticket-data", ticket);
};
const emitClockLobbyData = (s, clockData) => {
  s.emit("lobby-clock-data", clockData);
};
const emitClockGameData = (s, { lobbyId }, clockData) => {
  s.emit("game-clock-data", clockData);
  s.broadcast.to(lobbyId).emit("game-clock-data", clockData);
};
module.exports = {
  emitMessage,
  emitGameStartData,
  emitGameData,
  emitGameResults,
  emitRematchMessage,
  emitResetGame,
  emitTicketData,
  emitMessageLeft,
  emitClockLobbyData,
  emitClockGameData,
};
