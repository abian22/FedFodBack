FROM node:20

WORKDIR /app

# COPY package*.json ./

RUN npm install

COPY package.json ./uploads /app/uploads


CMD ["node", "index.js"]