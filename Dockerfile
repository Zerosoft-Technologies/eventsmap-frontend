# ---- Base Builder ----
FROM node:24-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# ---- Production Runner ----
FROM node:24-alpine AS runner

WORKDIR /app

# Install static server
RUN npm install -g serve

# Copy built files only
COPY --from=builder /app/dist ./dist

EXPOSE 3000

# Serve built production files
CMD ["serve", "-s", "dist", "-l", "3000"]
