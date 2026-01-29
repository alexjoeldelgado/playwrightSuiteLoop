const { expect } = require("@playwright/test");

// Create Dashboard page object
class BoardPage {
    /**
    * @param {import('@playwright/test').Page} page
    */
    constructor(page) {
        this.page = page
    }
    // Dynamically locate the correct nav button to click
    appNavItem(appName) {
        return this.page.locator(`xpath=//*[self::h2][text()="${appName}"]`);
    }
    // Identify the specified column element
    columnContainer(columnName) {
        return this.page.locator(`xpath=//*[self::h2][text()="${columnName}"]/ancestor::div[1]`);
    }
    // Within the previous column, identify the specified card element
    taskCardInColumn(columnName, taskTitle) {
        const column = this.columnContainer(columnName);
        return column.locator(`xpath=//*[self::h3][text()="${taskTitle}"]/ancestor::div[1]`);
    }
    // Within the previous card, identify the specified tag element(s)
    tagInCard(taskTitle, tagText, columnName) {
        const card = this.taskCardInColumn(columnName, taskTitle);
        return card.locator(`xpath=//*[self::span][text()="${tagText}"]`);
    }
    // Click on the specified application
    async openApp(appName) {
        const navItem = this.appNavItem(appName);
        await expect(navItem).toBeVisible({ timeout: 10_000 });
        await navItem.click();
    }
    // Ensure the tag(s) exist within the specified card which resides inside the specified column
    async assertTaskInColumn({ columnName, taskTitle, expectedTags }) {
        // Verify the column exists
        const column = this.columnContainer(columnName);
        await expect(column).toBeVisible({ timeout: 10_000 });

        // Verify the task exists in that column
        const card = this.taskCardInColumn(columnName, taskTitle);
        await expect(card).toBeVisible({ timeout: 10_000 });

        // Verify tags exist for a specific task card
        for (const tag of expectedTags) {
            const tagElement = this.tagInCard(taskTitle, tag, columnName);
            await expect(tagElement).toBeVisible({ timeout: 10_000 });
        }

    }
}

// Export Object
module.exports = { BoardPage };