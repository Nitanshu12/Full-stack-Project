# ─────────────────────────────────────────────────────────────
# CollabSphere Frontend — Production Dockerfile
# Multi-stage build:
#   Stage 1 → Node  : builds the Vite/React app (npm run build)
#   Stage 2 → Nginx : serves the static files with a lightweight server
# ─────────────────────────────────────────────────────────────

# ── Stage 1: Builder ─────────────────────────────────────────
# Full Node environment — needed to compile the React/Vite app.
# This stage is DISCARDED after the build; it never ships in the final image.
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files first to leverage Docker layer caching.
# Dependencies are re-installed only when package.json changes.
COPY package*.json ./

# Install ALL dependencies (including devDependencies for Vite, ESLint, etc.)
RUN npm ci

# Copy the rest of the source code
COPY . .

# Build the production-optimised static bundle into /app/dist
RUN npm run build

# ── Stage 2: Production Server ────────────────────────────────
# Minimal nginx image — tiny footprint, fast startup.
# Contains ONLY the built static files; no Node, no source code.
FROM nginx:alpine AS production

# Copy the compiled static files from the builder stage
# /usr/share/nginx/html is nginx's default document root
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx config (handles SPA client-side routing)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Nginx serves on port 80 (standard HTTP)
EXPOSE 80

# Start nginx in the foreground (required for Docker containers)
CMD ["nginx", "-g", "daemon off;"]
