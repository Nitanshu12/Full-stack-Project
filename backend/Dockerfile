# ─────────────────────────────────────────────────────────────
# CollabSphere Backend — Production Dockerfile
# Multi-stage build: only production dependencies in final image
# ─────────────────────────────────────────────────────────────

# ── Stage 1: Dependency Installer ────────────────────────────
# Uses a full Node image to install ONLY production dependencies.
# Keeping this in a separate stage means devDependencies
# (nodemon, jest, etc.) never make it into the final image.
FROM node:22-alpine AS deps

WORKDIR /app

# Copy package files first — Docker caches this layer separately.
# Re-installing node_modules only happens when package.json changes.
COPY package*.json ./

# --omit=dev skips devDependencies (nodemon, jest, supertest...)
# Produces a lean node_modules for production use
RUN npm ci --omit=dev

# ── Stage 2: Production Runtime ───────────────────────────────
# Starts fresh from a minimal Alpine image.
# Only copies what is needed to run the app — no build tools, no dev deps.
FROM node:22-alpine AS production

# Set NODE_ENV so Express enables production optimisations
ENV NODE_ENV=production

WORKDIR /app

# Copy the clean production node_modules from the deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy all application source code
COPY . .

# The Express server listens on port 8080 (defined in server.js)
EXPOSE 8080

# Use "npm start" → "node server.js" (NOT nodemon) for production
CMD ["npm", "start"]
