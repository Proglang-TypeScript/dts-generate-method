FROM node:lts-alpine AS builder

WORKDIR /usr/local/app

COPY package*.json ./
ENV NODE_ENV=development
RUN npm ci

COPY . .
RUN npm run build

# -------------------------------------------------

FROM node:lts-alpine

WORKDIR /usr/local/app
RUN chown node:node -R /usr/local/app
USER node

ENV NODE_ENV=production

COPY package*.json ./
COPY --from=builder /usr/local/app/dist ./dist

RUN npm ci

RUN mkdir /usr/local/app/output

ENTRYPOINT [ "node", "./dist/index.js" ]