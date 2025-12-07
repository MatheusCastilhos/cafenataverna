FROM node:20-alpine

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos de dependências
COPY package*.json ./

# Instala as dependências
RUN npm ci --only=production

# Copia o código da aplicação
COPY . .

# Expõe a porta da aplicação
EXPOSE 5000

# Comando para iniciar a aplicação
CMD ["node", "src/server.js"]
