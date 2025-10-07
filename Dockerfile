# Use uma imagem base completa do Node LTS
FROM node:lts 

# Define o diretório de trabalho
WORKDIR /usr/src/app

# Define o usuário node como o proprietário dos arquivos
# Isso ajuda a evitar problemas de permissão durante a instalação
USER node 

# Instale as dependências de sistema para o Chrome/Chromedriver
# Use 'root' temporariamente para instalar pacotes de sistema
USER root
RUN apt-get update && apt-get install -y \
    wget \
    gnupg \
    curl \
    libglib2.0-0 \
    libnss3 \
    libxss1 \
    libasound2 \
    mesa-utils \
    # Limpa o cache para reduzir o tamanho final da imagem
    && rm -rf /var/lib/apt/lists/*

# Volta para o usuário node para as operações npm
USER node

# Copia os arquivos package.json e package-lock.json
COPY package*.json ./

# Instala as dependências do Node.js
# As dependências globais ou os drivers serão instalados aqui
RUN npm install

# Copia o restante do código da aplicação (testes, configs)
COPY . .

# Comando padrão
# No Jenkins, você não usará este CMD. O docker-compose.yml irá substituí-lo
# pelo comando de espera ativa (wait-for-it) + npx wdio.
CMD ["npx", "wdio", "run", "wdio.conf.ts"]
