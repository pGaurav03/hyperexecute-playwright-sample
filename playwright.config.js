const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
    testDir: './tests',
    // the-internet login takes ~50s on the LambdaTest grid, so 60s was too tight
    timeout: 120000,
    // one worker per HyperExecute VM -- parallelism comes from
    // "autosplit + concurrency" in yaml/hyperexecute.yaml, not from here.
    workers: 1,
    retries: 0,

    // 'list' for readable console output, 'junit' so HyperExecute can parse
    // pass/fail per scenario, 'allure' results feed HyperExecute's native
    // Allure integration (yaml `partialReports`) -- resultsDir MUST be a
    // subfolder of the same parent named in that yaml's `location` ('reports').
    reporter: [
        ['list'],
        ['junit', { outputFile: 'reports/junit/results.xml' }],
        ['allure-playwright', { resultsDir: 'reports/allure-results' }]
    ]
});
