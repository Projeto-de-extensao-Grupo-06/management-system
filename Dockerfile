# Estágio único usando Node
FROM node:20-alpine
WORKDIR /app

# Copia os arquivos de dependência e instala
COPY package*.json ./
RUN npm install

# Copia o restante do código fonte e faz o build da aplicação
COPY . .
RUN npm run build

RUN npm install -g serve

EXPOSE 3000

# Comando para servir a pasta "dist" (onde o vite gera o build)
CMD ["serve", "-s", "dist", "-l", "3000"]
