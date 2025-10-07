pipeline {
    agent any

    environment {
        // Define o host para o WebdriverIO no container.
        WDIO_HOST = 'selenium-hub'
    }

    stages {

        stage('Checkout & Setup') {
            steps {
                echo 'Limpando workspace e fazendo checkout (o Jenkins usa a credencial do SCM)...'
                deleteDir()
                // Este comando usa a URL e as Credenciais configuradas na interface do Job.
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                echo 'Construindo imagem Docker com dependências do Node.js...'
                sh 'docker build -t wdio-project-image .'
            }
        }

        stage('Run E2E Tests') {
            steps {
                echo 'Executando testes E2E com Docker Compose...'
                // A imagem construída será usada pelo docker-compose.yml.
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
            allure(
                id: 'allure-report', 
                source: 'allure-results', 
                report: 'AllureReport'
            )
            
            echo "Pipeline concluído. Status: ${currentBuild.result}"
        }
    }
}