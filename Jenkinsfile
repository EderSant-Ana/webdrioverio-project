pipeline {
    agent any
    
    // Configurações do ambiente de teste.
    environment {
        // Variáveis do ambiente Jenkins
	    // Mantemos só nome da variável pública; o valor será lido com withCredentials
	    GITHUB_USERNAME = "EderSant-Ana"
        
        // Define o host para o WebdriverIO no container.
        WDIO_HOST = 'selenium-hub'
    }

    stages {
        stage('Checkout Source Code') {
            steps {
                // Clona o repositório, garantindo que o Jenkins use o PAT para autenticação.
                // Esta stage é crucial para evitar o erro "Authentication failed".
                git branch: 'main', 
                    credentialsId: env.GITHUB_TOKEN, 
                    url: 'https://github.com/EderSant-Ana/webdrioverio-project'
            }
        }

        stage('Build Docker Image') {
            steps {
                // Constrói a imagem Docker do seu projeto de testes.
                // O WebdriverIO e todas as dependências do Node.js serão instaladas aqui.
                script {
                    sh 'docker build -t wdio-project-image .'
                }
            }
        }

        stage('Run E2E Tests') {
            steps {
                // Executa o docker-compose.yml.
                // O '--abort-on-container-exit' garante que todos os serviços (Hub/Chrome) 
                // sejam derrubados assim que o container 'wdio-tests' terminar.
                sh 'docker compose up --build --abort-on-container-exit wdio-tests'
            }
        }
    }

    post {
        // O bloco 'always' garante que estas etapas rodem sempre, mesmo que os testes falhem.
        always {
            script {
                // 1. Limpeza do Docker:
                // Derruba containers, redes e libera recursos.
                sh 'docker compose down'
            }
            
            // 2. Publicação do Allure Report:
            // O Allure Report precisa de um plugin instalado no Jenkins.
            // A pasta 'allure-results' é gerada e mapeada para o host via docker-compose.yml.
            allure(
                id: 'allure-report', 
                source: 'allure-results', 
                report: 'AllureReport'
            )
            
            // 3. Resultado Final do Pipeline:
            echo "Pipeline concluído. Status: ${currentBuild.result}"
        }
        
        failure {
            // Em caso de falha de teste (ex: código de saída != 0), marca o build como UNSTABLE ou FAILURE
            // e exibe uma mensagem de erro.
            echo 'Os testes de E2E falharam. Verifique os logs e o Allure Report.'
        }
    }
}