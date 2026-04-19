const { Server } = require("socket.io");
const env = require("../config/env");
const { setSocketServer } = require("../services/socketService");

function attachSockets(server) {
  const io = new Server(server, {
    cors: {
      origin: env.clientUrl,
      credentials: true
    }
  });

  io.on("connection", (socket) => {
    socket.emit("system:hello", {
      message: "Realtime alert channel connected",
      timestamp: new Date().toISOString()
    });
  });

  setSocketServer(io);
  return io;
}

module.exports = attachSockets;
