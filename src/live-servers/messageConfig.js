const str = {
  victory: {
    title: "Congratulations!",
    message: "You are Victorious! Play again?",
  },
  defeat: { title: "Defeat!", message: "You were defeated! Play again?" },
  draw: { title: "Draw", message: "Draw play again?" },
};
const inverseStr = {
  defeat: "victory",
  victory: "defeat",
  draw: "draw",
};

module.exports = { str, inverseStr };
