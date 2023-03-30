FROM node:18.15-alpine

WORKDIR /app

COPY package*.json .

RUN npm install

COPY src ./src

COPY tsconfig.json .
COPY babel.config.js .

RUN npm run tsc

EXPOSE 8001

CMD ["npm","run","start"]
