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
                checkout scm
                
                // CRÍTICO: Cria e garante permissão de escrita (777) para os diretórios 
                // que serão mapeados como volumes no docker-compose.yml. 
                // Isso é essencial para que o container 'wdio-tests' (rodando como usuário 'node') 
                // possa gravar os relatórios e imagens de regressão visual no host.
                echo 'Garantindo permissões de escrita para os diretórios de resultados...'
                sh 'mkdir -p allure-results .tmp/actual .tmp/baseline'
                sh 'chmod -R 777 allure-results .tmp'
            }
        }

        /* * O stage 'Build Docker Image' foi removido. 
        * O Docker Compose fará o build da imagem 'wdio-tests' automaticamente 
        * ao rodar o comando 'docker compose up --build'.
        */

        stage('Run E2E Tests') {
            steps {
                echo 'Executando testes E2E com Docker Compose...'
                // --build: Garante que a imagem wdio-tests seja construída ou atualizada.
                // --abort-on-container-exit: Para o pipeline se o serviço de testes (wdio-tests) falhar.
                sh 'docker compose up --build --abort-on-container-exit wdio-tests'
            }
        }
    }

    post {
        always {
            script {
                // Limpeza do Docker
                echo 'Limpando containers e redes do Docker Compose...'
                sh 'docker compose down'
            }
            
            // Publicação do Allure Report.
            allure(results: [[path: 'allure-results']])
            
            echo "Pipeline concluído. Status: ${currentBuild.result}"
        }
    }
}
