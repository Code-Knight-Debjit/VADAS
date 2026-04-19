const http = require("http");
const app = require("./app");
const env = require("./config/env");
const connectDb = require("./config/db");
const attachSockets = require("./sockets");
const { log } = require("./utils/logger");

async function bootstrap() {
  await connectDb();
  const server = http.createServer(app);
  attachSockets(server);

  server.listen(env.port, () => {
    log("server", `Backend running on port ${env.port}`);
  });
}

bootstrap().catch((error) => {
  console.error(error);
  process.exit(1);
});
