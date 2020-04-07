FROM node:lts-alpine AS builder

RUN apk update

WORKDIR /usr/local/app
COPY package*.json ./
RUN npm install

COPY . .

RUN npm run test && \
	npm run build && \
	npm prune --production

# -------------------------------------------------

FROM node:lts-alpine

RUN apk update

WORKDIR /usr/local/app

COPY --from=builder /usr/local/app/node_modules ./node_modules
COPY --from=builder /usr/local/app/dist ./dist
COPY --from=builder /usr/local/app/package.json ./package.json

RUN npm link

ENTRYPOINT [ "dts-compare" ]