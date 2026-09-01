let io;

function init(server) {
  const { Server } = require("socket.io");

  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      credentials: true,
    },

    transports: ["websocket"],
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });

  return io;
}

function getIO() {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }

  return io;
}

function emitNotification(payload) {
  if (io) {
    io.emit("notification", payload);
  }
}

function emitBookingUpdate(payload) {
  if (io) {
    io.emit("booking:update", payload);
  }
}

function emitAdminUpdate(payload) {
  if (io) {
    io.emit("admin:update", payload);
  }
}

module.exports = {
  init,
  getIO,
  emitNotification,
  emitBookingUpdate,
  emitAdminUpdate,
};