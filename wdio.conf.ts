// wdio.conf.ts (Final)

// Importamos Options apenas para referência.
import type { Options } from '@wdio/types'

// Detecta se está rodando no ambiente de CI (via 'docker run' com a flag -e CI_RUN=true)
const isCIExecution = !!process.env.CI_RUN

// Removemos a tipagem Options.WebdriverIO para evitar erros TS(2353)
export const config = {
    
    // ====================
    // Runner Configuration
    // ====================
    runner: 'local',
    
    // ====================
    // Host / Grid Settings
    // ====================
    // O WebdriverIO se conecta ao host local (seu PC ou o container)
    hostname: 'localhost',

    // ====================
    // Test Files
    // ====================
    // CORREÇÃO FINAL: Usa um caminho flexível para encontrar testes em 'test/' ou 'test/subpasta/'
    // Se seus testes estiverem em 'test/specs/', use: './test/specs/**/*.ts'
    specs: ['./test/**/*.ts'], 
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
                    '--headless=new',
                    '--disable-gpu',
                    '--no-sandbox', // CRÍTICO para Docker
                    '--disable-dev-shm-usage', // Boa prática para Docker
                    '--window-size=1920,1080',
                    // REMOVIDO: '--incognito' (Causa falha de sessão)
                ],
            },
            'wdio:options': {
                disableBiDi: true
            }
        }
    ],

    // ====================
    // Services
    // ====================
    // CORREÇÃO: Removemos 'chromedriver' completamente.
    // O WebdriverIO (agora como 'local' runner) gerencia o driver para o Chrome instalado.
    services: ['visual'], 

    // ====================\n    // Logging & Timeouts
    // ====================
    logLevel: 'info',
    bail: 0,
    waitforTimeout: 10000,
    connectionRetryTimeout: 120000,
    connectionRetryCount: 3,

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
}