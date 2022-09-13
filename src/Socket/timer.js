const {
  emitClockLobbyData,
  emitClockGameData,
} = require("../live-servers/socketEmit");

const timers = {};

const startLobbyTimer = (s, player, seconds) => {
  timers[`timerLobby${player.uid}`] = setInterval(() => {
    seconds += 1;
    emitClockLobbyData(s, { isRunning: true, seconds });
  }, 1000);
};
const startGameTimer = (s, game, startTime) => {
  timers[`${game.gameName}Timer${game.lobbyId}`] = setInterval(() => {
    startTime += 1;
    emitClockGameData(s, { startTime });
  }, 1000);
};
const clearLobbyTimer = (s, player) => {
  clearInterval(timers[`timerLobby${player.uid}`]);
  emitClockLobbyData(s, { isRunning: false, seconds: 0 });
};
const clearGameTimer = (s, game) => {
  clearInterval(timers[`${game.gameName}Timer${game.lobbyId}`]);
  emitClockGameData(s, { isRunning: false, seconds: 0 });
};

module.exports = {
  startLobbyTimer,
  clearLobbyTimer,
  startGameTimer,
  clearGameTimer,
};
