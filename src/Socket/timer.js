const { emitClockLobbyData } = require("../live-servers/socketEmit");
const { v4: uuidv4 } = require("uuid");

const timers = {};

const timer = (count, direction, isRunning) => {
  let seconds = 0;
  if (isRunning) {
    setImmediate(function () {
      let date = new Date().toLocaleTimeString();
      console.log("date", date);
      seconds += 1;
      console.log("seconds", seconds);
    }, 1000);
  }
  console.log("count, direction", count, direction);
};

const startLobbyTimer = (socket, seconds) => {
  const clockId = uuidv4();
  timers[`timerLobby${clockId}`] = setInterval(() => {
    seconds += 1;
    emitClockLobbyData(socket, { clockId, isRunning: true, seconds });
  }, 1000);
};
const clearLobbyTimer = (socket, clock) => {
  clearInterval(timers[`timerLobby${clock.clockId}`]);
  emitClockLobbyData(socket, false, 0);
};

module.exports = { timer, startLobbyTimer, clearLobbyTimer };
