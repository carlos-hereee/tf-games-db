require("dotenv").config();
const express = require("express");
const { Server } = require("socket.io");
const { createServer } = require("http");
const cors = require("cors");
const helmet = require("helmet");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const userRouter = require("./src/routes/user-router.js");
const { socketManager } = require("./src/Socket/index.js");

// env
const port = process.env.PORT;
const uri = process.env.MONGOOSE_URI;
const clientURL = process.env.CLIENT_BASE_URL;
// set up
const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: { origin: clientURL, methods: ["GET", "POST"] },
});
app.use(helmet());
app.use(cookieParser());
app.use(cors({ credentials: true, origin: clientURL }));
app.use(express.json());
app.use("/users/", userRouter);

// initialize socket for the server
io.on("connection", (socket) => socketManager(socket));
// tesing server
app.get("/", (req, res) => {
  res.status(200).json({ message: "api is running" });
});

mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    server.listen(port, () => {
      console.log(`\n *** Server listening on port ${port} *** \n`);
    });
  })
  .catch((e) => console.log("e", e));
