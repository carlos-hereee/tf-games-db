require("dotenv").config();
const express = require("express");
const { Server } = require("socket.io");
const { createServer } = require("http");
const cors = require("cors");
const helmet = require("helmet");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const userRouter = require("./routes/user-router.js");
const {
  findOpenQueue,
  createTicket,
  startGame,
  cancelTicket,
} = require("./live-servers/lobby");
const {
  findGame,
  updateGameboard,
  requestRematch,
  resetGame,
  removeGame,
} = require("./live-servers/game");
const {
  emitMessage,
  emitGameData,
  emitGameResults,
  emitRematchMessage,
  emitResetGame,
  emitTicketData,
  emitMessageLeft,
} = require("./live-servers/socketEmit.js");

// CONNECT TO MONGOOSEDB
const uri = `mongodb+srv://${process.env.MONGOOSE_USERNAME}:${process.env.MONGOOSE_PASSWORD}@cluster0.nb8m83l.mongodb.net/?retryWrites=true&w=majority`;

const port = process.env.PORT || 4937;
const server = express();
const httpServer = createServer(server);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONT_END_BASE_URL,
    methods: ["GET", "POST"],
  },
});
server.use(helmet());
server.use(cookieParser());
server.use(
  cors({
    credentials: true,
    origin: process.env.FRONT_END_BASE_URL,
  })
);
server.use(express.json());
server.use("/users/", userRouter);

// initialize socket for the serve r
// TODO: MOVE TO AN EMPTY DIRECTORY
io.on("connection", (socket) => {
  const playerId = socket.handshake.query.id;
  if (playerId) {
    socket.join(playerId);
    console.log(`connection made on socket id : ${playerId}`);
  }
  // check if player is already in a game
  const { game } = findGame(playerId);
  if (game.lobbyId) {
    // send player to game
    socket.join(game.lobbyId);
    emitGameData(socket, game);
  }

  socket.on("cancel-ticket", ({ ticket, player }) => {
    const res = cancelTicket(ticket);
    if (!res.ticket) {
      emitTicketData(socket, res.ticket);
      emitMessage(socket, player, "canceled the search");
    }
  });
  socket.on("new-game", ({ player, game }) => {
    // search for an open queue
    const { openTicket } = findOpenQueue(game);
    if (!openTicket) {
      // add player to queue
      const { ticket } = createTicket(player, game);
      if (ticket.lobbyId) {
        socket.join(ticket.lobbyId);
        emitTicketData(socket, ticket);
        emitMessage(socket, player, "joined the queue");
      } else emitMessage(socket, player, "servers are down, try agian later");
    }
    if (openTicket) {
      // notify both players
      socket.join(openTicket.lobbyId);
      const msg = "Opponent found, starting match!";
      emitMessage(socket, player, msg, openTicket.lobbyId);
      // send both players the game data
      const { game } = startGame(openTicket, player);
      emitGameData(socket, game);
    }
  });

  socket.on("player-leave", ({ player, game }) => {
    socket.leave(game.lobbyId);
    // delete game
    removeGame(game);
    emitMessageLeft(socket, game, player);
  });

  socket.on("place-mark", ({ game, cell, player }) => {
    // updated the game board
    const { updatedGame, result } = updateGameboard(game, cell, player);
    emitGameData(socket, updatedGame);
    // check for win
    if (result === "win" || result === "draw") {
      emitGameResults(socket, game.lobbyId, result);
    }
  });
  socket.on("request-rematch", ({ game, isPlayer1 }) => {
    const { players } = requestRematch(game, isPlayer1);
    if (players.player2.rematch && players.player1.rematch) {
      const { reset } = resetGame(game);
      // send reset game to both player
      emitResetGame(socket, reset);
    } else {
      emitRematchMessage(socket, game, players, isPlayer1);
    }
  });
});
// tesing server
server.get("/", (req, res) => {
  res.status(200).json({ message: "api is running" });
});
mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    server.listen(port, () => {
      console.log(`\n *** Server listening on port ${port} *** \n`);
    });
    httpServer.listen(1200, () => console.log("1200"));
  })
  .catch((e) => console.log("e", e));
