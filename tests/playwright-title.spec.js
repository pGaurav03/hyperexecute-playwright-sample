const { test, expect } = require('../lambdatest-setup');

test('playwright.dev should have the correct title', async ({ page }) => {
    await page.goto('https://playwright.dev/');
    await expect(page).toHaveTitle(/Playwright/);

    await page.getByRole('link', { name: 'Get started' }).click();
    await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});
