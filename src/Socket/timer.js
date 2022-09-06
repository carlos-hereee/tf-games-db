const { emitClockLobbyData } = require("../live-servers/socketEmit");

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

const startTimerFrom0 = (socket, isRunning) => {
  if (isRunning) {
    let seconds = 0;
    setInterval(() => {
      seconds += 1;
      emitClockLobbyData(socket, isRunning, seconds);
    }, 1000);
  }
};
module.exports = { timer, startTimerFrom0 };
