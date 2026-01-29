const { expect } = require("@playwright/test");

// Create Login Page Object
class LoginPage {
    /**
   *@param {import('@playwright/test').Page} page
   */

    // Identify all elements to be used on Login Page with tested xpaths
    constructor(page) {
        this.page = page;
        this.loginTitle = page.locator("xpath=//h1[@class='text-2xl font-bold ml-2']")
        this.emailInput = page.locator("xpath=//input[@id='username']");
        this.passwordInput = page.locator("xpath=//input[@id='password']");
        this.submitButton = page.locator("xpath=//button[@type='submit']");
    }

    // Navigate to specified url and Validate the correct page is loaded
    async goto(baseUrl, splashTitle) {
        // Navigate to Page
        await this.page.goto(baseUrl, { waitUntil: "domcontentloaded" });
        // Ensure the page is loaded and the expected elements are on the page
        await expect(this.loginTitle).toHaveText(splashTitle)
        await expect(this.emailInput).toBeVisible();
        await expect(this.passwordInput).toBeVisible();
    }
    // Login to page using specified credentials and click submit
    async login(email, password) {
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await Promise.all([
            // Ensure the test does not fail due to network lag
            this.page.waitForLoadState("networkidle").catch(() => {}),
            // Click submit 
            this.submitButton.click()
        ]);
    }

    // Create validation that login was successful and dashboard is displayed
    async assertLoggedIn(dashTitle) {
        const postLoginValidation = this.page.getByText(dashTitle);
        await expect(postLoginValidation).toBeVisible({ timeout: 10000 });
    }
}

// Export object
module.exports = { LoginPage };