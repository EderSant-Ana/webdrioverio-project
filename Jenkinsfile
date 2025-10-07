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
                
                // --- CORREÇÃO FINAL PARA EACCES EM .tmp ---
                // Cria a pasta .tmp no workspace e define permissão universal de escrita.
                // Isso resolve problemas de permissão quando o Docker mapeia o volume.
                echo 'Garantindo permissões de escrita (chmod 777) para o volume .tmp...'
                sh 'mkdir -p .tmp/actual'
                sh 'chmod -R 777 .tmp'
                // ------------------------------------------
            }
        }

        stage('Build Docker Image') {
            steps {
                echo 'Construindo imagem Docker com correções internas de permissão (chown)...'
                sh 'docker build -t wdio-project-image .'
            }
        }

        stage('Run E2E Tests') {
            steps {
                echo 'Executando testes E2E com Docker Compose...'
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
            
            // Publicação do Allure Report: Corrigido para a sintaxe específica do seu plugin.
            // A maioria dos plugins Allure antigos espera o argumento 'results'.
            allure(results: 'allure-results')
            
            echo "Pipeline concluído. Status: ${currentBuild.result}"
        }
    }
}
```

---

A principal mudança está no bloco `post`:

```groovy
allure(results: 'allure-results')
