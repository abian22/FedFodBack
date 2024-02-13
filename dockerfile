FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN mkdir -p /app/uploads && chmod 777 /app/uploads

COPY . .

CMD ["node", "index.js"]