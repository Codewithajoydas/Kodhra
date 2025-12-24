let io;

module.exports = {
  init: (server) => {
    const { Server } = require("socket.io");
    io = new Server(server);
    return io;
  },
  getIO: () => {
    if (!io) {
      throw new Error("Socket.io not initialized!");
    }
    console.log("ℹ️ Socket.io initialized");
    return io;
  },
};
