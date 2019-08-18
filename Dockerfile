FROM arm32v7/node:10 as builder

WORKDIR /build

COPY . .

RUN npm install \
    && npm run build


FROM arm32v7/node:10 as production

WORKDIR /prod_modules

COPY package.json ./package.json

RUN npm install --only=production


FROM arm32v7/node:10-slim

WORKDIR /app/TopSongs

COPY --from=builder /build/package.json ./package.json
COPY --from=builder /build/dist ./dist
COPY --from=production /prod_modules/node_modules ./node_modules

CMD [ "npm", "start" ]