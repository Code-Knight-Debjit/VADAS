const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.resolve(__dirname, "../../../.env") });
dotenv.config();

module.exports = {
  port: process.env.PORT || 5000,
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
  mongoUri: process.env.MONGODB_URI || "mongodb://localhost:27017/accident-alerts",
  jwtSecret: process.env.JWT_SECRET || "development-secret",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  smtp: {
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    from: process.env.EMAIL_FROM || "alerts@example.com"
  },
  twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN,
    from: process.env.TWILIO_PHONE_NUMBER
  },
  mapboxToken: process.env.MAPBOX_ACCESS_TOKEN || "",
  rag: {
    provider: process.env.RAG_PROVIDER || "local",
    openAiKey: process.env.OPENAI_API_KEY || "",
    openAiModel: process.env.OPENAI_EMBEDDING_MODEL || "text-embedding-3-small",
    ollamaBaseUrl: process.env.OLLAMA_BASE_URL || "http://localhost:11434",
    ollamaEmbedModel: process.env.OLLAMA_EMBED_MODEL || "nomic-embed-text",
    ollamaChatModel: process.env.OLLAMA_CHAT_MODEL || "llama3"
  }
};
