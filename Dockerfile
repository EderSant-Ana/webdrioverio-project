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
    # Limpeza para reduzir o tamanho da imagem
    && rm -rf /var/lib/apt/lists/*

# Definir o diretório de trabalho dentro do container
WORKDIR /usr/src/app

# Copiar arquivos de dependência
COPY package*.json ./

# --- Correção de Permissão EACCES ---
# Mudar temporariamente para o usuário root para instalar as dependências
# Isso resolve o problema de permissão ao criar a pasta node_modules
USER root
RUN npm install
# Voltar para o usuário 'node' (não-root) para maior segurança na execução
USER node
# ------------------------------------

# Copiar o restante do código do projeto
COPY . .

# Comando de entrada: O container do teste só precisa de shell, pois o Docker Compose
# executa o comando 'wdio' no serviço 'wdio-tests'
CMD ["/bin/bash"]