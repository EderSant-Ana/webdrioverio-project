FROM docker.io/library/node:lts

# Instalar dependências necessárias para o Chrome (Headless)
RUN apt-get update && apt-get install -y \
    wget \
    gnupg \
    curl \
    libglib2.0-0 \
    libnss3 \
    libxss1 \
    libasound2 \
    mesa-utils \
    && rm -rf /var/lib/apt/lists/*

# Definir o diretório de trabalho dentro do container
WORKDIR /usr/src/app

# Copiar arquivos de dependência
COPY package*.json ./

# Mudar temporariamente para root para instalar as dependências
USER root
RUN npm install
# Corrigir a posse da pasta para o usuário 'node'
# Isso resolve o EACCES ao criar a pasta 'allure-results'
RUN chown -R node:node /usr/src/app

# Voltar para o usuário 'node' (não-root) para maior segurança na execução
USER node

# Copiar o restante do código do projeto
COPY . .

# Comando de entrada
CMD ["/bin/bash"]