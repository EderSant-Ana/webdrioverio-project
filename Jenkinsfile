pipeline {
    agent any

    environment {
        // ID da credencial que deve ser configurada no Jenkins como "Secret text" 
        // e conter o Personal Access Token (PAT) do GitHub.
        GITHUB_TOKEN = "GITHUB_TOKEN"
        
        // Define o host para o WebdriverIO no container.
        WDIO_HOST = 'selenium-hub'
    }

    stages {

        stage('Cleanup Docker') {
            steps {
                echo 'Garantindo que todos os containers Docker anteriores estejam parados e removidos...'
                sh '''
                    # Derruba containers e redes do docker-compose se estiverem rodando
                    docker compose down || true
                    # Limpa containers e imagens antigas para liberar espaço
                    docker container prune -f || true
                    docker image prune -f || true
                '''
            }
        }

        stage('Checkout Code') {
            steps {
                echo 'Clonando repositório de forma autenticada...'
                deleteDir() // Remove todos os arquivos do workspace

                // O withCredentials injeta o valor do PAT (token) na variável 'GITHUB_TOKEN_VALUE'
                withCredentials([string(credentialsId: env.GITHUB_TOKEN, variable: 'GITHUB_TOKEN')]) {
                    // Clona o repositório usando o token injetado
                    sh """
                        git clone -b main https://oauth2:${GITHUB_TOKEN}@github.com/EderSant-Ana/webdrioverio-project.git .
                    """
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                echo 'Construindo imagem Docker com dependências do Node.js...'
                // Constrói a imagem baseada no Dockerfile na raiz do workspace
                sh 'docker build -t wdio-project-image .'
            }
        }

        stage('Run E2E Tests') {
            steps {
                echo 'Executando testes E2E com Docker Compose...'
                // O docker compose up executa os containers (selenium-hub, chrome, wdio-tests)
                // O --abort-on-container-exit derruba todos quando o container 'wdio-tests' termina.
                sh 'docker compose up --build --abort-on-container-exit wdio-tests'
            }
        }
    }

    post {
        always {
            script {
                // 1. Limpeza do Docker:
                echo 'Limpando containers e redes do Docker Compose...'
                sh 'docker compose down'
            }
            
            // 2. Publicação do Allure Report:
            // Assumindo que 'allure-results' foi mapeado no docker-compose.yml para o workspace do Jenkins.
            allure(
                id: 'allure-report', 
                source: 'allure-results', 
                report: 'AllureReport'
            )
            
            echo "Pipeline concluído. Status: ${currentBuild.result}"
        }
    }
}