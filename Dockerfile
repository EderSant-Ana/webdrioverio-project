# Dockerfile (Final)

# 1. Base image Node.js
FROM docker.io/library/node:lts

# 2. Instalar dependências e o navegador Google Chrome (Headless)
RUN apt-get update && apt-get install -y --no-install-recommends \
    wget \
    gnupg \
    libglib2.0-0 \
    libnss3 \
    libxss1 \
    libasound2 \
    mesa-utils \
    fonts-liberation \
    libappindicator3-1 \
    libgtk-3-0 \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | gpg --dearmor -o /etc/apt/keyrings/google-chrome.gpg \
    && echo "deb [arch=amd64 signed-by=/etc/apt/keyrings/google-chrome.gpg] https://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google-chrome.list \
    && apt-get update \
    && apt-get install -y google-chrome-stable \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean

# 3. Definir o diretório de trabalho dentro do container
WORKDIR /usr/src/app

# 4. Copiar arquivos de dependência e instalar
COPY package*.json .
RUN npm install

# 5. Corrigir permissões para o usuário 'node'
RUN chown -R node:node /usr/src/app

# 6. Voltar para o usuário 'node' (não-root)
USER node

# 7. Copiar o restante do código do projeto
COPY . .

# 8. Comando de entrada padrão (será sobrescrito no Jenkinsfile)
CMD ["/bin/bash"]