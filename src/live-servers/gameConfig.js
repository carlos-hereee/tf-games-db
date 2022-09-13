const config = {
  tictactoe: {},
  snakeGame: {
    lastRenderTime: 0,
    SNAKE_SPEED: 1,
    EXPANSION_RATE: 1,
    inputDirection: { x: 0, y: 0 },
    lastInputDirection: { x: 0, y: 0 },
    snakeBody: [{ x: 3, y: 3 }],
    newSegments: 0,
  },
};

module.exports = { config };
