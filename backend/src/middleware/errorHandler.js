function errorHandler(error, req, res, next) {
  const status = error.status || 500;
  const payload = {
    message: error.message || "Internal server error"
  };

  if (process.env.NODE_ENV !== "production") {
    payload.stack = error.stack;
  }

  res.status(status).json(payload);
}

module.exports = errorHandler;
