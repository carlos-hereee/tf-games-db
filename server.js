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
  updateRequestedRematch,
  checkRematch,
} = require("./live-servers/game");
const {
  emitMessage,
  emitGameData,
  emitBroadcast,
  emitGameStart,
  emitBroadcastGameStart,
  emitBroadcastGameData,
  emitGameResults,
  emitBroadcastGameResults,
  emitRematchMessage,
  emitBroadcastRematchMessage,
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
    if (result !== "continue") {
      emitGameResults(socket, result);
      emitBroadcastGameResults(socket, result, updatedGame.lobbyId);
    }
    emitGameData(socket, updatedGame, updatedGame.lobbyId);
    emitBroadcastGameData(socket, updatedGame, updatedGame.lobbyId);
  });
  socket.on("request-rematch", ({ player, game }) => {
    // update and wait for player response
    const { response } = updateRequestedRematch(player, game);
    if (response) {
      const { success, resetGame } = checkRematch(game);
      if (success) {
        emitGameStart(socket, resetGame);
        emitBroadcastGameStart(socket, resetGame, resetGame.lobbyId);
        // notify players
        emitRematchMessage(socket, "Starting match");
        emitBroadcastRematchMessage(socket, "Starting match", game.lobbyId);
      } else {
        // notify players
        emitRematchMessage(socket, "You requested a rematch");
        emitBroadcastRematchMessage(
          socket,
          `${player.nickname} has requested a rematch`,
          game.lobbyId
        );
      }
    }
    if (!response) {
      emitRematchMessage(
        socket,
        "Unable to request rematch; opponent left the room"
      );
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
