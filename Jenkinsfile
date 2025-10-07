pipeline {
    // Usa qualquer agente disponível
    agent any

    // Opções de pipeline: Se os testes falharem, pule as stages subsequentes.
    options {
        skipStagesAfterUnstable()
        timestamps()
    }

    stages {
        stage('Checkout Source Code') {
            steps {
                echo 'Clonando o repositório do GitHub...'
                // Adicionando explicitamente o projeto Git.
                // Isso garante que a última versão do código esteja no workspace antes do build.
                sh """
                    git clone -b main https://${env.GITHUB_TOKEN}@github.com/EderSant-Ana/webdrioverio-project.git
                """    
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    // Constrói a imagem base (com Node.js, dependências e código) a partir do Dockerfile.
                    // O nome 'wdio-ts-runner' deve coincidir com o nome usado no docker-compose.yml.
                    // O ponto ('.') indica o contexto do build.
                    docker.build('wdio-ts-runner', '.')
                }
            }
        }

        stage('Run E2E Tests') {
            steps {
                echo 'Iniciando testes E2E via Docker Compose...'
                // Executa os serviços (Hub, Chrome, e Tests).
                // --build: Força o uso da imagem mais recente (opcional, mas seguro).
                // --abort-on-container-exit: Garante que o compose pare todos os serviços
                // assim que o container 'wdio-tests' sair.
                sh 'docker compose up --abort-on-container-exit wdio-tests'
            }
        }
    }

    // Ações que ocorrem após todas as stages
    post {
        // O bloco 'always' é CRÍTICO para garantir a limpeza dos recursos, mesmo que os testes falhem.
        always {
            echo 'Iniciando limpeza dos containers Docker...'
            // Derruba todos os containers, redes e volumes criados pelo compose.
            sh 'docker compose down'
        }

        // Publica o Allure Report se a etapa de testes for concluída (sucesso ou falha).
        success {
            echo 'Testes concluídos com sucesso. Publicando Allure Report...'
            // O Allure Plugin do Jenkins lê a pasta 'allure-results' que foi mapeada
            // do container para o workspace do Jenkins via volume no docker-compose.yml.
            allure([
                report: 'allure-results', // Pasta onde os resultados JSON/XML brutos estão
                expiration: 30 // Mantém o relatório por 30 dias
            ])
        }
        
        failure {
            echo 'Testes falharam. Publicando Allure Report...'
            allure([
                report: 'allure-results',
                expiration: 30
            ])
        }
    }
}
