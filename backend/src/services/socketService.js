let ioRef;

function setSocketServer(io) {
  ioRef = io;
}

function emitEvent(event, payload) {
  if (ioRef) {
    ioRef.emit(event, payload);
  }
}

module.exports = {
  emitEvent,
  setSocketServer
};
