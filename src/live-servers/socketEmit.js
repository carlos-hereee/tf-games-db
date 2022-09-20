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
const emitResetData = (s, game) => {
  s.emit("game-reset", game);
  s.broadcast.to(game.lobbyId).emit("game-reset", game);
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
  const result = {
    message: `${isPlayer1 ? game.player1.nickname : game.player2.nickname} ${
      isPlayer1 && game.player1.rematch
        ? "requested"
        : !isPlayer1 && game.player2.rematch
        ? "requested"
        : "canceled"
    } rematch`,
    game,
  };
  s.emit("rematch", {
    ...result,
    rematch: isPlayer1 ? game.player1.rematch : game.player2.rematch,
  });
  s.broadcast.to(game.lobbyId).emit("rematch", {
    ...result,
    rematch: isPlayer1 ? game.player2.rematch : game.player1.rematch,
  });
};
// send rematch
const emitMessageLeft = (s, game, player) => {
  s.emit("player-left");
  s.broadcast.to(game.lobbyId).emit("opponent-left", {
    message: `${player.nickname} left`,
  });
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
  emitTicketData,
  emitResetData,
  emitMessageLeft,
  emitClockLobbyData,
  emitClockGameData,
};
