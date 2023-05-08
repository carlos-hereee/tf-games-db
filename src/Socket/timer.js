const {
  emitClockLobbyData,
  emitClockGameData,
} = require("../live-servers/socketEmit");

const timers = {};

const startLobbyTimer = (s, player) => {
  let start = new Date().toLocaleTimeString();
  setInterval(() => {
    const timer = new Date().toLocaleTimeString();
    emitClockLobbyData(s, { isRunning: true, timer, start });
  }, 1000);
};
const startGameTimer = (s, game) => {
  let startTime;
  timers[`${game.gameName}Timer${game.lobbyId}`] = setInterval(() => {
    const timer = Date.now();
    if (startTime === undefined) {
      startTime = timer;
    }
    emitClockGameData(s, game, { isRunning: true, startTime, timer });
  }, 1000);
};
const clearLobbyTimer = (s, game, player) => {
  clearInterval(timers[`timerLobby${player.uid}`]);
  emitClockLobbyData(s, game, { isRunning: false, timer: 0 });
};
const clearGameTimer = (s, game) => {
  clearInterval(timers[`${game.gameName}Timer${game.lobbyId}`]);
  emitClockGameData(s, game, { isRunning: false, timer: 0 });
};

module.exports = {
  startLobbyTimer,
  clearLobbyTimer,
  startGameTimer,
  clearGameTimer,
};
