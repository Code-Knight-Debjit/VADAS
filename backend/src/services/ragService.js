const fs = require("fs");
const path = require("path");
const pdfParse = require("pdf-parse");
const { embedText } = require("./embeddingService");

const storagePath = path.join(__dirname, "../rag/storage/vectors.json");

function ensureStorage() {
  if (!fs.existsSync(storagePath)) {
    fs.writeFileSync(storagePath, JSON.stringify({ chunks: [] }, null, 2));
  }
}

function loadStore() {
  ensureStorage();
  return JSON.parse(fs.readFileSync(storagePath, "utf-8"));
}

function saveStore(store) {
  ensureStorage();
  fs.writeFileSync(storagePath, JSON.stringify(store, null, 2));
}

function chunkText(text) {
  return text
    .split(/\n\s*\n/)
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .flatMap((chunk) => {
      if (chunk.length <= 700) {
        return [chunk];
      }

      const slices = [];
      for (let cursor = 0; cursor < chunk.length; cursor += 700) {
        slices.push(chunk.slice(cursor, cursor + 700));
      }

      return slices;
    });
}

function cosineSimilarity(a, b) {
  const length = Math.min(a.length, b.length);
  let dot = 0;
  let normA = 0;
  let normB = 0;

  for (let index = 0; index < length; index += 1) {
    dot += a[index] * b[index];
    normA += a[index] * a[index];
    normB += b[index] * b[index];
  }

  return dot / (Math.sqrt(normA) * Math.sqrt(normB) || 1);
}

async function extractTextFromFile(file) {
  if (file.mimetype === "application/pdf") {
    const data = await pdfParse(fs.readFileSync(file.path));
    return data.text;
  }

  return fs.readFileSync(file.path, "utf-8");
}

async function ingestDocument({ file, documentId, title }) {
  const text = await extractTextFromFile(file);
  const chunks = chunkText(text);
  const store = loadStore();
  const embeddedChunks = [];

  for (const [index, chunk] of chunks.entries()) {
    const embedding = await embedText(chunk);
    embeddedChunks.push({
      id: `${documentId}-${index}`,
      documentId,
      title,
      text: chunk,
      embedding
    });
  }

  store.chunks = store.chunks.filter((entry) => entry.documentId !== documentId);
  store.chunks.push(...embeddedChunks);
  saveStore(store);

  return { chunkCount: embeddedChunks.length };
}

async function queryKnowledgeBase(question) {
  const queryEmbedding = await embedText(question);
  const store = loadStore();

  const topMatches = store.chunks
    .map((chunk) => ({
      ...chunk,
      score: cosineSimilarity(queryEmbedding, chunk.embedding)
    }))
    .sort((left, right) => right.score - left.score)
    .slice(0, 4);

  const context = topMatches.map((item) => item.text).join("\n\n");
  const fallbackAnswer = context
    ? `Here is the most relevant guidance from the safety knowledge base:\n\n${context}`
    : "The knowledge base does not have a direct answer yet. Upload accident safety procedures, SOPs, or FAQ documents to improve responses.";

  return {
    answer: fallbackAnswer,
    citations: topMatches.map((item) => ({
      id: item.id,
      title: item.title,
      score: Number(item.score.toFixed(3))
    }))
  };
}

module.exports = {
  ingestDocument,
  queryKnowledgeBase
};
