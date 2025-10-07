import type { Options } from '@wdio/types'

// Detecta se o WebdriverIO está sendo executado dentro de um container Docker com Selenium Grid
const isDockerGrid = process.env.WDIO_HOST === 'selenium-hub'

export const config: Options.WebdriverIO = {
    //
    // ====================
    // Host / Grid Settings
    // ====================
    hostname: isDockerGrid ? process.env.WDIO_HOST : 'localhost',
    port: isDockerGrid ? 4444 : undefined,
    path: isDockerGrid ? '/wd/hub' : '/',

    //
    // ====================
    // Runner Configuration
    // ====================
    runner: 'local',
    autoCompileOpts: {
        tsNodeOpts: {
            transpileOnly: true,
            project: './tsconfig.json'
        }
    },

    //
    // ====================
    // Test Files
    // ====================
    specs: ['./test/specs/**/*.ts'],
    exclude: [],

    //
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
                    '--headless',
                    '--no-sandbox',
                    '--disable-dev-shm-usage',
                    '--disable-gpu',
                    '--disable-extensions',
                    '--window-size=1920,1080'
                ]
            }
        }
    ],

    //
    // ====================
    // Logging / Timeouts
    // ====================
    logLevel: 'info',
    bail: 0,
    waitforTimeout: 10000,
    connectionRetryTimeout: 120000,
    connectionRetryCount: 3,

    //
    // ====================
    // Services
    // ====================
    // ✅ Em ambiente local, o Chrome é gerenciado automaticamente.
    // ✅ Em ambiente Docker/Grid, conectamos apenas ao Hub.
    services: isDockerGrid ? [] : ['chromedriver'],

    //
    // ====================
    // Framework / Reporters
    // ====================
    framework: 'mocha',
    reporters: [
        'spec',
        [
            'allure',
            {
                outputDir: 'allure-results',
                disableWebdriverStepsReporting: true,
                disableWebdriverScreenshotsReporting: false
            }
        ]
    ],

    //
    // ====================
    // Mocha Options
    // ====================
    mochaOpts: {
        ui: 'bdd',
        timeout: 60000
    },

    //
    // ====================
    // Hooks (opcionais)
    // ====================
    before: async function () {
        console.log(`🔧 Executando testes em: ${isDockerGrid ? 'Docker Grid' : 'Ambiente Local'}`)
    }
}
