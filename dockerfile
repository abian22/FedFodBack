FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY ./uploads /app/uploads


CMD ["node", "index.js"]