// Overrides Playwright's `page` fixture so every test runs in a real browser
// on LambdaTest's cloud (cdp.lambdatest.com) instead of a local browser on the
// HyperExecute VM -- HyperExecute only tracks/reports scenarios that open a
// real LambdaTest session, otherwise it marks them "skipped".
const base = require('@playwright/test');
const playwrightVersion = require('@playwright/test/package.json').version;

const test = base.test.extend({
    page: async ({}, use, testInfo) => {
        const capabilities = {
            // browser/OS of the LambdaTest cloud browser -- overridable from the
            // yaml's `env:` block, defaults below
            browserName: process.env.LT_BROWSER || 'Chrome',
            browserVersion: process.env.LT_BROWSER_VERSION || 'latest',
            'LT:Options': {
                platform: process.env.LT_PLATFORM || 'Windows 10',
                build: 'HyperExecute Playwright Sample',
                name: testInfo.title,
                user: process.env.LT_USERNAME,
                accessKey: process.env.LT_ACCESS_KEY,
                playwrightClientVersion: playwrightVersion,
                video: true,
                console: true,
                network: true
            }
        };

        const browser = await base.chromium.connect(
            `wss://cdp.lambdatest.com/playwright?capabilities=${encodeURIComponent(JSON.stringify(capabilities))}`
        );
        const page = await browser.newPage();

        await use(page);

        // push the test's pass/fail to the LambdaTest session dashboard
        const status = testInfo.status === testInfo.expectedStatus ? 'passed' : 'failed';
        const remark = testInfo.error ? testInfo.error.message.slice(0, 250) : 'OK';
        await page.evaluate(() => {},
            `lambdatest_action: ${JSON.stringify({ action: 'setTestStatus', arguments: { status, remark } })}`);
        await page.close();
        await browser.close();
    }
});

module.exports = { test, expect: base.expect };
