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
// send game initial result
const emitInitialGameResults = (s, game) => {
  const player = {
    leftGame: false,
    rematch: false,
    result: str[game.gameResult],
    message: str[game.gameResult].message,
  };
  const opponent = {
    leftGame: false,
    rematch: false,
    result: str[inverseStr[game.gameResult]],
    message: str[inverseStr[game.gameResult]].message,
  };
  s.emit("game-results", { result: player });
  // broadcast the opposite message
  s.broadcast.to(game.lobbyId).emit("game-results", { result: opponent });
};
// send rematch
const emitRematch = (s, game, isPlayer1) => {
  console.log("game.player1.rematch", game.player1.rematch);
  const player = {
    message: `${isPlayer1 ? game.player1.nickname : game.player2.nickname} ${
      isPlayer1 && game.player1.rematch ? "requested" : "canceled"
    } rematch`,
    game,
  };
  const opponent = {
    message: `${isPlayer1 ? game.player1.nickname : game.player2.nickname} ${
      !isPlayer1 && game.player2.rematch ? "requested" : "canceled"
    } rematch`,
    game,
  };
  s.emit("rematch", { result: player });
  s.broadcast.to(game.lobbyId).emit("rematch", { result: opponent });
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
  emitInitialGameResults,
  emitRematch,
  emitResetGame,
  emitTicketData,
  emitMessageLeft,
  emitClockLobbyData,
  emitClockGameData,
};
