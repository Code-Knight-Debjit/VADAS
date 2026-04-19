function log(scope, message, meta = {}) {
  const payload = {
    scope,
    message,
    ...meta,
    timestamp: new Date().toISOString()
  };

  console.log(JSON.stringify(payload));
}

module.exports = { log };
