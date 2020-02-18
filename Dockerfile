FROM node:12-alpine as builder

WORKDIR /build

COPY . .

RUN npm install \
    && npm run build



FROM node:12-alpine as production

WORKDIR /prod_modules

COPY package.json ./package.json

RUN npm install --only=production



FROM node:12-alpine

WORKDIR /app/SpotifyScraper

COPY --from=builder /build/package.json ./package.json
COPY --from=builder /build/dist ./dist
COPY --from=production /prod_modules/node_modules ./node_modules

CMD [ "npm", "start" ]