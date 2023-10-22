import http from "http";
import cors from "cors";
import morgan from "morgan";
import Peer from "peer";
import { Server } from "socket.io";
import express, { Express } from "express";

import { PORT } from "./src/config";

const app: Express = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
const peerServer = Peer.PeerServer({ port: 9000, path: "/peerjs" });

const port = PORT;
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

io.on("connection", (socket) => {
  console.log("1. 🚀[SOCKET] ~ usuario conectado");

  socket.on("join-room", ({ roomId, userId }) => {
    console.log("2. 🚀[SOCKET] ~ user join room");
    socket.join(roomId);
    console.log("3. 🚀[SOCKET] ~ socket join room:", roomId);
    socket.to(roomId).emit("user-connected", userId);
    console.log("4. 🚀[SOCKET] ~ emit user-connected", roomId, userId);
  });
});

peerServer.on("connection", (client) => {
  console.log("1. 🚀[PEER] ~ usuario conectado");
});

/* init server */
server.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
