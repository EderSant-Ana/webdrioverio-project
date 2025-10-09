pipeline {
    agent any

    environment {
        // CI_RUN ainda é útil para logs ou hooks futuros, mas não mais para services.
        CI_RUN = 'true'
    }

    stages {
        
        stage('Checkout & Setup') {
            steps {
                echo 'Limpando workspace e fazendo checkout...'
                deleteDir()
                checkout scm
                
                sh 'mkdir -p allure-results .tmp/actual .tmp/baseline'
                sh 'chmod -R 777 allure-results .tmp'
            }
        }

        stage('Build Docker Image') {
            steps {
                echo 'Construindo imagem Docker para execução dos testes...'
                sh 'docker build -t wdio-project:latest .'
            }
        }

        stage('Run E2E Tests') {
            steps {
                echo 'Executando testes E2E no container Docker...'
                
                sh """
                    docker run --rm \
                    -v ${PWD}/allure-results:/usr/src/app/allure-results \
                    -v ${PWD}/.tmp:/usr/src/app/.tmp \
                    -e CI_RUN=true \
                    wdio-project:latest \
                    npm run wdio
                """
            }
        }
    }

    post {
        always {
            allure(results: [[path: 'allure-results']])
            
            echo "Pipeline concluído..."
        }
    }
}