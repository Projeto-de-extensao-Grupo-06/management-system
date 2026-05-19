FROM node:18-alpine
WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY server.js db.json ./

EXPOSE 3000
CMD ["node", "server.js"]
