FROM node:24.21.0-bookworm-slim@sha256:2fe369e969550cde8e867afc3fe370b260140cab4a23d467074295b42163d553 AS builder
WORKDIR /usr/local/app
COPY package*.json ./
RUN npm ci --ignore-scripts
COPY . .
RUN npm run build
FROM node:24.21.0-bookworm-slim@sha256:2fe369e969550cde8e867afc3fe370b260140cab4a23d467074295b42163d553
WORKDIR /usr/local/app
RUN chown node:node /usr/local/app
USER node
ENV NODE_ENV=production
COPY --chown=node:node package*.json ./
COPY --chown=node:node --from=builder /usr/local/app/dist ./dist
RUN npm ci --ignore-scripts --omit=dev && mkdir output
ENTRYPOINT ["node", "./dist/index.js"]
