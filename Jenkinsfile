pipeline {
    agent any // Ou um agente específico que tenha o Docker instalado

    options {
        // Garante que o diretório de trabalho seja limpo antes de cada build
        cleanWs()
    }

    stages {
        stage('Cleanup and Setup') {
            steps {
                script {
                    // Limpa resultados anteriores e containers para garantir um run limpo
                    echo "Limpando ambiente Docker e resultados Allure antigos..."
                    sh 'docker compose down --volumes || true' // Ignora erro se não houver containers
                    sh 'rm -rf allure-results'
                    sh 'mkdir allure-results' // Garante que a pasta exista para o mapeamento de volume
                }
            }
        }

        stage('Run End-to-End Tests') {
            steps {
                script {
                    echo "Construindo e executando testes E2E via Docker Compose..."
                    // --abort-on-container-exit: Derruba todos os serviços assim que o wdio-tests terminar.
                    // wdio-tests: Roda apenas o serviço de testes e suas dependências.
                    // O comando de espera do Hub no docker-compose.yml será executado aqui.
                    sh 'docker compose up --build --abort-on-container-exit wdio-tests'
                }
            }
        }

        stage('Generate and Publish Allure Report') {
            steps {
                script {
                    echo "Publicando Allure Report a partir de allure-results..."
                    // O plugin Allure Jenkins lê os arquivos gerados na pasta mapeada
                    // Certifique-se de que o 'allure' está configurado nas Global Tool Configurations do Jenkins.
                    allure([
                        reportBuildPolicy: 'ALWAYS',
                        results: [[path: 'allure-results']]
                    ])
                }
            }
        }
        
        stage('Final Cleanup') {
            steps {
                script {
                    // Derruba containers restantes e volumes (se não forem volumes nomeados)
                    echo "Derrubando serviços Docker..."
                    sh 'docker compose down'
                }
            }
        }
    }
}
