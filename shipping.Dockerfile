# Imagem base derivada do Node
FROM node

# Diretório de trabalho
WORKDIR /app

# Copia os arquivos para a imagem
COPY . /app

# Instala as dependências
RUN npm install

# Inicia o microsserviço Shipping
CMD ["node", "/app/services/shipping/index.js"]
