# Etapa base com Node.js e dependências do Chrome
FROM node:20-bullseye AS base

# Instala utilitários essenciais e dependências do Chrome
RUN apt-get update && apt-get install -y \
    curl \
    unzip \
    gnupg \
    wget \
    ca-certificates \
    fonts-liberation \
    libappindicator3-1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libc6 \
    libcairo2 \
    libcups2 \
    libdbus-1-3 \
    libexpat1 \
    libfontconfig1 \
    libgbm1 \
    libglib2.0-0 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libpango-1.0-0 \
    libx11-6 \
    libx11-xcb1 \
    libxcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxi6 \
    libxrandr2 \
    libxrender1 \
    libxss1 \
    libxtst6 \
    xdg-utils \
    && rm -rf /var/lib/apt/lists/*

# Instala Google Chrome (versão estável)
RUN wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | apt-key add - && \
    echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google.list && \
    apt-get update && apt-get install -y google-chrome-stable && \
    rm -rf /var/lib/apt/lists/*

# Instala ChromeDriver automaticamente compatível
RUN npm install -g chromedriver --unsafe-perm=true

# Cria diretório da aplicação
WORKDIR /usr/src/app

# Copia dependências do projeto
COPY package*.json ./

# Instala dependências Node.js (sem cache)
RUN npm ci --omit=dev

# Copia o restante do código
COPY . .

# Define variáveis padrão (úteis para o wdio.conf.ts)
ENV WDIO_HOST=localhost
ENV PATH=$PATH:/node_modules/.bin

# Executa os testes (modo padrão)
CMD ["npx", "wdio", "run", "./wdio.conf.ts"]
