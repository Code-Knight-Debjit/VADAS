const crypto = require("crypto");
const env = require("../config/env");

function localEmbedding(text) {
  const vector = new Array(128).fill(0);
  const hash = crypto.createHash("sha256").update(text).digest();

  for (let index = 0; index < vector.length; index += 1) {
    vector[index] = hash[index % hash.length] / 255;
  }

  return vector;
}

async function fetchOpenAiEmbedding(text) {
  const response = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.rag.openAiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: env.rag.openAiModel,
      input: text
    })
  });

  if (!response.ok) {
    throw new Error("OpenAI embeddings request failed");
  }

  const payload = await response.json();
  return payload.data[0].embedding;
}

async function fetchOllamaEmbedding(text) {
  const response = await fetch(`${env.rag.ollamaBaseUrl}/api/embeddings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: env.rag.ollamaEmbedModel,
      prompt: text
    })
  });

  if (!response.ok) {
    throw new Error("Ollama embeddings request failed");
  }

  const payload = await response.json();
  return payload.embedding;
}

async function embedText(text) {
  if (env.rag.provider === "openai" && env.rag.openAiKey) {
    return fetchOpenAiEmbedding(text);
  }

  if (env.rag.provider === "ollama") {
    return fetchOllamaEmbedding(text);
  }

  return localEmbedding(text);
}

module.exports = { embedText };
