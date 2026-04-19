# ============================================================
# VADAS – Vehicle Accident Detection and Alert System
# Root Dockerfile (single-container, monorepo build)
# ============================================================
# Stage 1 — Build the React frontend
# ============================================================
FROM node:20-alpine AS frontend-build

WORKDIR /app

# Copy root workspace manifest first for layer caching
COPY package.json ./
COPY frontend/package.json ./frontend/package.json
COPY backend/package.json ./backend/package.json

# Install all workspace dependencies from root
RUN npm install

# Copy full source
COPY . .

# Build the Vite / React app
WORKDIR /app/frontend
RUN npm run build

# ============================================================
# Stage 2 — Production image (Node backend + built frontend)
# ============================================================
FROM node:20-alpine AS production

# Install nginx to serve the static frontend assets
RUN apk add --no-cache nginx

WORKDIR /app

# Re-copy workspace manifests and install production deps only
COPY package.json ./
COPY backend/package.json ./backend/package.json
COPY frontend/package.json ./frontend/package.json
RUN npm install --omit=dev

# Copy backend source
COPY backend/ ./backend/

# Copy compiled frontend from the build stage into nginx's web root
COPY --from=frontend-build /app/frontend/dist /usr/share/nginx/html

# Persist RAG upload / vector-store directories across restarts
VOLUME ["/app/backend/src/rag/uploads", "/app/backend/src/rag/storage"]

# Nginx: serve frontend on 80, backend API on 5000
EXPOSE 80 5000

# Copy a minimal nginx config so /api/* is proxied to the backend
COPY docker/nginx.conf /etc/nginx/http.d/default.conf

# Startup: launch nginx in the background, then run the Node backend
CMD nginx && cd /app/backend && npm run start