require("dotenv").config();
const express = require("express");
const { Server } = require("socket.io");
const { createServer } = require("http");
const cors = require("cors");
const helmet = require("helmet");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const userRouter = require("./routes/user-router.js");
const { findLobby, removePlayer, makeLobby } = require("./live-servers/lobby");
const { createGame } = require("./live-servers/game");
const { v4: uuidv4 } = require("uuid");
const {
  emitMessage,
  emitGameData,
  emitBroadcast,
} = require("./live-servers/socketEmit.js");

// CONNECT TO MONGOOSEDB
const uri = `mongodb+srv://${process.env.MONGOOSE_USERNAME}:${process.env.MONGOOSE_PASSWORD}@cluster0.9er2n.mongodb.net/take-five-db?retryWrites=true&w=majority`;

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
  socket.on("send-message", (message) => {
    socket.emit("receive-message", {
      message: `joined lobby`,
    });
  });
  console.log(`connection made on socket id : ${id}`);
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
  socket.on("search-match", async (message) => {
    console.log(message);
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
