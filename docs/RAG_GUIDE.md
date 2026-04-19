# RAG Administration Guide

## 1. Add New Data

1. Sign in to the dashboard.
2. Open the Settings page.
3. Upload a `.pdf`, `.txt`, or `.md` file under "Upload knowledge document".
4. The backend chunks the document, generates embeddings, and stores vectors in `backend/src/rag/storage/vectors.json`.

Recommended document types:

- Roadside emergency SOPs
- First-response checklists
- Insurance claim guides
- Internal operator runbooks
- Driver training handbooks

## 2. Update or Retrain Embeddings

This project supports three providers:

- `RAG_PROVIDER=local`: deterministic local embedding fallback for offline development
- `RAG_PROVIDER=openai`: OpenAI embeddings via `OPENAI_API_KEY`
- `RAG_PROVIDER=ollama`: local embedding model via Ollama

To refresh embeddings:

1. Replace or re-upload the source documents.
2. Delete `backend/src/rag/storage/vectors.json` if you want a fresh rebuild.
3. Re-upload the files so the system regenerates embeddings.

## 3. Deploy Locally with LLaMA 3

The app is already configured for local-model deployment through Ollama.

1. Install Ollama on the host machine.
2. Pull the required models:

```bash
ollama pull llama3
ollama pull nomic-embed-text
```

3. Set:

```env
RAG_PROVIDER=ollama
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_CHAT_MODEL=llama3
OLLAMA_EMBED_MODEL=nomic-embed-text
```

4. Restart the backend and upload documents again.

## 4. Secure API Key Configuration

- Never hardcode keys in source files.
- Keep secrets only in `.env` or your deployment secret manager.
- Rotate OpenAI, SMTP, and Twilio credentials regularly.
- In Docker or cloud hosting, inject secrets with environment variables or secret mounts.
- Do not expose `OPENAI_API_KEY` or messaging credentials to the frontend.
