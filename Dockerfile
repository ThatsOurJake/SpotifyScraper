FROM node:26-alpine as production

WORKDIR /prod_modules

COPY package.json package-lock.json ./

RUN npm ci --omit=dev



FROM node:26-alpine

WORKDIR /app/SpotifyScraper

COPY package.json package-lock.json ./
COPY src ./src
COPY --from=production /prod_modules/node_modules ./node_modules

CMD [ "npm", "start" ]
