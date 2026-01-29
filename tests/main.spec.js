const { test, expect } = require("@playwright/test");
const path = require("path");
const fs = require("fs");

const { LoginPage } = require("./pages/login.page");
const { BoardPage } = require("./pages/board.page");

// Load JSON test data
const dataPath = path.join(__dirname, "data", "testCases.json");
const testData = JSON.parse(fs.readFileSync(dataPath, "utf-8"));

test.describe("Playwright Test Suite - Data Driven", () => {
  test.beforeEach(async ({ page }) => {
    // Before each test, login to page
    const loginPage = new LoginPage(page);
    await loginPage.goto(testData.demoURL, testData.splashTitle);
    await loginPage.login(testData.credentials.email, testData.credentials.password);
    await loginPage.assertLoggedIn(testData.dashTitle);
  });

  for (const c of testData.cases) {
    test(`${c.id} - ${c.name}`, async ({ page }) => {
      const boardPage = new BoardPage(page);

      // Navigate to the relevant app board (Web Application / Mobile Application)
      await boardPage.openApp(c.application);

      // Assert task is in the expected column and has expected tags
      await boardPage.assertTaskInColumn({
        columnName: c.columnName,
        taskTitle: c.taskTitle,
        expectedTags: c.expectedTags,
      });
    });
  }
});
