# Vehicle Accident Detection and Alert System

A production-oriented monorepo for accident detection, emergency alert dispatch, realtime monitoring, offline failover, GPS tracking, and a document-backed RAG assistant.

## Folder Structure

```text
.
|-- backend
|   |-- src
|   |   |-- config
|   |   |-- controllers
|   |   |-- middleware
|   |   |-- models
|   |   |-- rag
|   |   |-- routes
|   |   |-- services
|   |   |-- sockets
|   |   `-- utils
|   `-- Dockerfile
|-- frontend
|   |-- src
|   |   |-- api
|   |   |-- components
|   |   |-- context
|   |   |-- hooks
|   |   |-- layouts
|   |   `-- pages
|   `-- Dockerfile
|-- docs
|   |-- API.md
|   |-- DEPLOYMENT.md
|   `-- RAG_GUIDE.md
|-- docker-compose.yml
`-- .env.example
```

## Features Implemented

- React + Tailwind frontend with landing page, dashboard, contacts, alert history, and settings
- Node.js + Express + MongoDB backend with JWT authentication
- Realtime dashboard updates through Socket.IO
- 60-second smart-alert countdown with cancel/send actions
- Device-motion accident detection plus manual and hardware endpoint triggers
- GPS tracking with last-known-location fallback
- Store-and-forward local queue for offline or remote-area simulation
- SMS, email, and dashboard alert channels with mocked fallback behavior
- Contact priority management and incident audit logs
- RAG chatbot with document upload and local/OpenAI/Ollama embedding options
- Dockerized deployment support

## Quick Start

1. Copy `.env.example` to `.env`.
2. Copy `frontend/.env.example` to `frontend/.env` if you need custom frontend runtime values.
3. Install dependencies:

```bash
npm install
```

4. Run the backend:

```bash
npm run dev:backend
```

5. Run the frontend:

```bash
npm run dev:frontend
```

6. Open `http://localhost:5173`.

## Environment Variables

Core:

- `PORT`
- `CLIENT_URL`
- `MONGODB_URI`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`

Alerts:

- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`
- `EMAIL_FROM`
- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_PHONE_NUMBER`

RAG / AI:

- `RAG_PROVIDER`
- `OPENAI_API_KEY`
- `OPENAI_EMBEDDING_MODEL`
- `OLLAMA_BASE_URL`
- `OLLAMA_EMBED_MODEL`
- `OLLAMA_CHAT_MODEL`

Maps:

- `MAPBOX_ACCESS_TOKEN`
- `VITE_MAPBOX_TOKEN`

## API Documentation

See [docs/API.md](./docs/API.md), [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md), and [docs/RAG_GUIDE.md](./docs/RAG_GUIDE.md).
