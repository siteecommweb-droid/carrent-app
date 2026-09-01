function emitNotification(io, payload) {
  io.emit("notification", payload);
}

function emitBookingUpdate(io, payload) {
  io.emit("booking:update", payload);
}

function emitAdminUpdate(io, payload) {
  io.emit("admin:update", payload);
}

module.exports = {
  emitNotification,
  emitBookingUpdate,
  emitAdminUpdate,
};