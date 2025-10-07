import type { Options } from '@wdio/types'

// 1. Determina se a variável de ambiente WDIO_HOST está definida (indicando execução no Docker Grid)
const isDockerGrid = !!process.env.WDIO_HOST;

export const config: Options.WebdriverIO = {
    
    // Host: 'selenium-hub' no Docker, 'localhost' na máquina local.
    // Com o driver management nativo, 'localhost' ou omitir host funciona, mas vamos manter 'localhost' para clareza.
    hostname: isDockerGrid ? 'selenium-hub' : 'localhost', 
    
    // Porta: 4444 é usada pelo Grid. Localmente, o gerenciador de drivers nativo escolhe uma porta (geralmente 9515)
    // Se o host não for 'localhost', ele assume Grid/Remote e usa a porta 4444.
    port: isDockerGrid ? 4444 : undefined,
    
    // Path: Usamos '/wd/hub' para o Grid. Localmente, o caminho é geralmente omitido ou definido como '/'.
    path: isDockerGrid ? '/wd/hub' : '/',

    // ====================
    // Runner Configuration
    // ====================
    runner: 'local',
    tsConfigPath: './tsconfig.json',
    
    //
    // ==================
    // Specify Test Files
    // ==================
    specs: [
        './test/specs/**/*.ts'
    ],
    exclude: [],
    
    //
    // ============
    // Capabilities
    // ============
    maxInstances: 10,
    
    capabilities: [{
        acceptInsecureCerts: true,
        browserName: 'chrome',
        'goog:chromeOptions': {
            args: [
                '--headless',
                '--disable-gpu',
                '--disable-dev-shm-usage',
                '--no-sandbox',
                '--start-maximized',
            ]
        }
    }],

    //
    // ===================
    // Test Configurations
    // ===================
    logLevel: 'info',
    bail: 0,
    waitforTimeout: 10000,
    connectionRetryTimeout: 120000,
    connectionRetryCount: 3,
    
    //
    // ===================================
    // Test runner services (CORREÇÃO CRÍTICA)
    // ===================================
    // No modo local, removemos o 'selenium-standalone' (que é deprecated) e confiamos no gerenciamento nativo do WDIO.
    services: isDockerGrid ? 
        // Modo Grid (Docker/CI): Apenas o visual service
        ['visual']
        : 
        // Modo Local (Host): Apenas o visual service. O driver do Chrome é iniciado automaticamente.
        ['visual'],


    // Framework you want to run your specs with.
    framework: 'mocha',
    
    // Test reporter for stdout. (O LUGAR CERTO PARA SPEC E ALLURE)
    reporters: [
        'spec',
        ['allure', {
        outputDir: 'allure-results', 
        disableWebdriverStepsReporting: true,
        disableWebdriverScreenshotsReporting: false,
        }],
    ],

    // Options to be passed to Mocha.
    mochaOpts: {
        ui: 'bdd',
        timeout: 60000
    },

    // ... (Seus hooks permanecem aqui)
} as unknown as Options.WebdriverIO // Adicionei 'as unknown as Options.WebdriverIO' para compatibilidade de tipagem
