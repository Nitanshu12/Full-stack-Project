
FROM node:22-alpine AS deps

WORKDIR /app


COPY package*.json ./


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
