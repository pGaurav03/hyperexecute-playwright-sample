const { test, expect } = require('../lambdatest-setup');

test('The Internet - should reject invalid credentials and then accept valid ones', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/login');

    // 1. wrong credentials -> expect an error message
    await page.fill('#username', 'wronguser');
    await page.fill('#password', 'wrongpassword');
    await page.click('button[type="submit"]');
    await expect(page.locator('#flash')).toContainText('Your username is invalid!');

    // 2. same page reloaded the form -> now try valid credentials
    await page.fill('#username', 'tomsmith');
    await page.fill('#password', 'SuperSecretPassword!');
    await page.click('button[type="submit"]');
    await expect(page.locator('#flash')).toContainText('You logged into a secure area!');
});
