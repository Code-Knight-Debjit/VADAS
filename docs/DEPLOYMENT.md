# Deployment Guide

## Local Development

1. Copy `.env.example` to `.env`.
2. Copy `frontend/.env.example` to `frontend/.env` if you want custom frontend API, socket, or Mapbox settings.
3. Start MongoDB locally or use Docker.
4. Install workspace dependencies:

```bash
npm install
```

5. Run the backend:

```bash
npm run dev:backend
```

6. Run the frontend:

```bash
npm run dev:frontend
```

## Docker

```bash
docker compose up --build
```

The services exposed are:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`
- MongoDB: `mongodb://localhost:27017`

## Production Notes

- Replace the default `JWT_SECRET`.
- Lock down CORS with your real frontend domain.
- Provide live SMTP and Twilio credentials if you want outbound notifications.
- Mount persistent storage for `backend/src/rag/uploads` and `backend/src/rag/storage`.
- Set `RAG_PROVIDER=ollama` when using a local LLaMA stack with Ollama.
