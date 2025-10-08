# 1. Base image Node.js (necessário para rodar wdio/npm)
FROM docker.io/library/node:lts

# 2. Instalar dependências necessárias para o Chrome (Headless)
# Removemos pacotes redundantes como 'xvfb' e 'wget' para o ambiente Grid Node/Docker.
RUN apt-get update && apt-get install -y \
    curl \
    libglib2.0-0 \
    libnss3 \
    libxss1 \
    libasound2 \
    mesa-utils \
    && rm -rf /var/lib/apt/lists/*

# 3. Definir o diretório de trabalho dentro do container
WORKDIR /usr/src/app

# 4. Copiar arquivos de dependência e instalar
# É CRÍTICO que o 'npm install' rode aqui para instalar o @wdio/local-runner e outros.
COPY package*.json ./
RUN npm install

# 5. Corrigir permissões para o usuário 'node'
# Garante que o usuário 'node' possa escrever os resultados (allure-results, .tmp)
RUN chown -R node:node /usr/src/app

# 6. Voltar para o usuário 'node' (não-root) para maior segurança na execução
USER node

# 7. Copiar o restante do código do projeto
COPY . .

# 8. Comando de entrada padrão (sobrescrito no docker-compose)
CMD ["/bin/bash"]
