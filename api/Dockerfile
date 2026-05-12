FROM node:18-alpine
WORKDIR /app

COPY api/package*.json ./
RUN npm ci --omit=dev

COPY api/server.js api/db.json ./

EXPOSE 3000
CMD ["node", "server.js"]
