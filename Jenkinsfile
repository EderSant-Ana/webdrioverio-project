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
                // Garante que o código é clonado usando a credencial PAT configurada na interface do Job.
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                echo 'Construindo imagem Docker com correções de permissão (Dockerfile com chown)...'
                // A imagem será construída usando o Dockerfile corrigido.
                sh 'docker build -t wdio-project-image .'
            }
        }

        stage('Run E2E Tests') {
            steps {
                echo 'Executando testes E2E com Docker Compose...'
                // O serviço 'wdio-tests' irá rodar os testes.
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
            // Usando a sintaxe de LISTA simples ('['resultado']') que funciona com a maioria das versões do plugin Allure.
            allure(['allure-results'])
            
            echo "Pipeline concluído. Status: ${currentBuild.result}"
        }
    }
}