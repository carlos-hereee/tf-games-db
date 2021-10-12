require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const userRouter = require("./routes/user-router.js");

const port = process.env.PORT || 4937;
const server = express();
server.use(helmet());
server.use(cors());
server.use(express.json());
server.use("/users/", userRouter);
//tesing server
server.get("/", (req, res) => {
  res.status(200).json({ status: "success", message: "api is running" });
});
server.listen(port, () => {
  console.log(`\n *** Server listening on port ${port} *** \n`);
});
