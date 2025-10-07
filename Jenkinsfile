pipeline {
    agent any

    environment {
        // Define o host para o WebdriverIO no container.
        WDIO_HOST = 'selenium-hub'
    }

    stages {

        stage('Checkout & Setup') {
            steps {
                echo 'Limpando workspace e fazendo checkout com credenciais do SCM...'
                deleteDir()
                // Este comando usa a URL e as Credenciais configuradas na interface do Job.
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                echo 'Construindo imagem Docker com correções de permissão...'
                // A imagem será construída usando o Dockerfile corrigido (com chown para EACCES).
                sh 'docker build -t wdio-project-image .'
            }
        }

        stage('Run E2E Tests') {
            steps {
                echo 'Executando testes E2E com Docker Compose...'
                // O docker compose up executa os containers (selenium-hub, chrome, wdio-tests).
                // O '--abort-on-container-exit' derruba tudo após o container de teste terminar.
                sh 'docker compose up --build --abort-on-container-exit wdio-tests'
            }
        }
    }

    post {
        always {
            script {
                // Limpeza do Docker: Derruba containers, redes e libera recursos.
                echo 'Limpando containers e redes do Docker Compose...'
                sh 'docker compose down'
            }
            
            // Publicação do Allure Report:
            // Usando a sintaxe moderna do plugin Allure.
            // A pasta 'allure-results' é mapeada para o workspace via docker-compose.yml.
            allure([
                allureResults: 'allure-results'
            ])
            
            echo "Pipeline concluído. Status: ${currentBuild.result}"
        }
    }
}