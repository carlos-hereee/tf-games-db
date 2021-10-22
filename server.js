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
  removePlayer,
  findOpenQueue,
  createQueueTicket,
  updateTicketAndStartMatch,
} = require("./live-servers/lobby");
const {
  findGame,
  updateGameboard,
  checkVictory,
  swapTurns,
} = require("./live-servers/game");
const {
  emitMessage,
  emitGameData,
  emitBroadcast,
  emitGameStart,
  emitBroadcastGameStart,
  emitBroadcastGameData,
} = require("./live-servers/socketEmit.js");

// CONNECT TO MONGOOSEDB
const uri = `mongodb+srv://${process.env.MONGOOSE_USERNAME}:${process.env.MONGOOSE_PASSWORD}@cluster0.9er2n.mongodb.net/take-five-db?retryWrites=true&w=majority`;

const Admin = { nickname: "Admin", uid: "silent-code" };
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

// initialize socket for the server
io.on("connection", (socket) => {
  const id = socket.handshake.query.id;
  socket.join(id);
  console.log(`connection made on socket id : ${id}`);
  // check if player is already in game
  const { result } = findGame(id);
  if (result) {
    socket.join(result.lobbyId);
    emitGameData(socket, result, result.lobbyId);
  }
  socket.on("leave", ({ player, lobbyId }) => {
    console.log("leave");
    const { removed, game } = removePlayer(player, lobbyId);
    if (removed) {
      io.to(lobbyId).emit("message", {
        player,
        message: `${player.nickname} has left`,
      });
      io.to(lobbyId).emit("gameData", { game, lobby });
    }
  });
  socket.on("search-match", async ({ player, game }) => {
    // seach for open queue
    const { openTicket } = findOpenQueue(game);
    if (!openTicket) {
      // add player to queue
      const { success } = createQueueTicket(player, game);
      if (success) {
        emitMessage(socket, player, "joined the queue");
      } else emitMessage(socket, player, "servers are down, try agian later");
    }
    if (openTicket) {
      const { lobbyId } = openTicket;
      // notify both players
      socket.join(lobbyId);
      emitMessage(socket, player, "Opponent found, starting match!");
      emitBroadcast(socket, lobbyId, "Opponent found, starting match!");
      // remove players from old queue and start game
      const { game } = updateTicketAndStartMatch(openTicket, player, lobbyId);
      // send both players the game data
      emitGameStart(socket, game);
      emitBroadcastGameStart(socket, game, lobbyId);
    }
  });
  socket.on("place-mark", ({ game, cell }) => {
    // updated the game board
    const { updatedGame, error, result } = updateGameboard(game, cell);
    if (error) {
      emitMessage(socket, Admin, error);
      emitBroadcast(socket, game.lobbyId, error);
    }
    // if (result !== "continue") {
    // }
    emitGameData(socket, updatedGame, updatedGame.lobbyId);
    emitBroadcastGameData(socket, updatedGame, updatedGame.lobbyId);
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
