const { emitClockLobbyData } = require("../live-servers/socketEmit");

const timers = {};

const startLobbyTimer = (socket, player, seconds) => {
  timers[`timerLobby${player.uid}`] = setInterval(() => {
    seconds += 1;
    emitClockLobbyData(socket, { isRunning: true, seconds });
  }, 1000);
  return () => clearInterval(timers[`timerLobby${player.uid}`]);
};
const clearLobbyTimer = (socket, player) => {
  clearInterval(timers[`timerLobby${player.uid}`]);
  emitClockLobbyData(socket, { isRunning: false, seconds: 0 });
};

module.exports = { startLobbyTimer, clearLobbyTimer };
