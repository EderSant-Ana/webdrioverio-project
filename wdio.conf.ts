import type { Options } from '@wdio/types'

// Detecta se está rodando no Docker Grid (variável de ambiente definida)
// O WDIO_HOST é definido nos ambientes docker-compose e Jenkinsfile
const isDockerGrid = !!process.env.WDIO_HOST

export const config: Options.WebdriverIO = {
    // ====================
    // Host / Grid Settings
    // ====================
    // Sempre usa o nome do serviço 'selenium-hub' ou 'localhost' para local/host
    hostname: isDockerGrid ? 'selenium-hub' : 'localhost',
    port: isDockerGrid ? 4444 : undefined,
    path: isDockerGrid ? '/wd/hub' : '/',

    // ====================
    // Runner Configuration
    // ====================
    // REMOVIDO: Quando usamos o Grid, não definimos um runner local explícito.
    // O WebdriverIO se conecta diretamente ao Grid (hostname:port).
    // O comando de execução (npx wdio run ...) se encarrega de iniciar o framework.
    // runner: 'local', // Linha removida
    tsConfigPath: './tsconfig.json',

    // ====================
    // Test Files
    // ====================
    specs: ['./test/specs/**/*.ts'],
    exclude: [],

    // ====================
    // Capabilities
    // ====================
    maxInstances: 5,

    capabilities: [
        {
            browserName: 'chrome',
            acceptInsecureCerts: true,
            'goog:chromeOptions': {
                args: [
                    '--headless=new',             // Novo modo headless mais estável
                    '--disable-gpu',
                    '--disable-dev-shm-usage',
                    '--no-sandbox',
                    '--start-maximized',
                    '--disable-blink-features=AutomationControlled'
                ],
            },
            // 🔧 Desativa o uso do protocolo BiDi para evitar o erro "Could not connect to Bidi protocol"
            'wdio:options': {
                disableBiDi: true
            }
        }
    ],

    // ====================
    // Logging & Timeouts
    // ====================
    logLevel: 'info',
    bail: 0,
    waitforTimeout: 10000,
    connectionRetryTimeout: 120000,
    connectionRetryCount: 3,

    // ====================
    // Services
    // ====================
    // Usamos 'visual' em ambos os casos, mas removemos 'chromedriver' e 'xvfb'
    // quando estamos no Grid (isDockerGrid).
    services: isDockerGrid
        ? ['visual'] // Executando via Selenium Grid (Docker): Apenas o serviço visual
        : ['chromedriver', 'visual'], // Executando localmente: Usa ChromeDriver para iniciar o navegador

    // ====================
    // Framework & Reporting
    // ====================
    framework: 'mocha',
    reporters: [
        'spec',
        [
            'allure',
            {
                outputDir: 'allure-results',
                disableWebdriverStepsReporting: true,
                disableWebdriverScreenshotsReporting: false,
            }
        ]
    ],

    mochaOpts: {
        ui: 'bdd',
        timeout: 60000
    },

    // ====================
    // Hooks (exemplo opcional)
    // ====================
    before: function () {
        console.log('🔧 Iniciando teste com WDIO...')
    }
} as unknown as Options.WebdriverIO
