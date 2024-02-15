FROM node:16

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV PORT=4000
ENV DB_NAME=AbiApp
ENV MONGODB_URI=mongodb+srv://Abian:DtF6dKt3icku2UIU@cluster0.jdwi1h4.mongodb.net/
ENV BCRYPT_SALTROUNDS=10
ENV SECRET=ThisIsaSecret
ENV GOOGLE_CLIENT_ID=117559184212-j99liov0t8l1ct5rb3rqf89c1a9sfjkt.apps.googleusercontent.com
ENV GOOGLE_CLIENT_SECRET=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

EXPOSE $PORT

CMD ["npm", "start"]
