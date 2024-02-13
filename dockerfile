FROM node:20

WORKDIR /app

# COPY package*.json ./
COPY package.json ./uploads /app/uploads

RUN npm install



CMD ["node", "index.js"]