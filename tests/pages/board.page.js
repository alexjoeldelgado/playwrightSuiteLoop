const { expect } = require("@playwright/test");

class BoardPage {
    /**
    * @param {import('@playwright/test').Page} page
    */
    constructor(page) {
        this.page = page
    }

    appNavItem(appName) {
        return this.page.locator(`xpath=//*[self::h2][text()="${appName}"]`);
    }
    columnContainer(columnName) {
        return this.page.locator(`xpath=//*[self::h2][text()="${columnName}"]/ancestor::div[1]`);
    }
    taskCardInColumn(columnName, taskTitle) {
        const column = this.columnContainer(columnName);
        return column.locator(`xpath=//*[self::h3][text()="${taskTitle}"]/ancestor::div[1]`);
    }
    tagInCard(taskTitle, tagText, columnName) {
        const card = this.taskCardInColumn(columnName, taskTitle);
        return card.locator(`xpath=//*[self::span][text()="${tagText}"]`);
    }
    async openApp(appName) {
        const navItem = this.appNavItem(appName);
        await expect(navItem).toBeVisible({ timeout: 10_000 });
        await navItem.click();
    }

    async assertTaskInColumn({ columnName, taskTitle, expectedTags }) {
        // Verify the column exists
        const column = this.columnContainer(columnName);
        await expect(column).toBeVisible({ timeout: 10_000 });

        // Verify the task exists in that column
        const card = this.taskCardInColumn(columnName, taskTitle);
        await expect(card).toBeVisible({ timeout: 10_000 });

        // Verify tags (contains-all behavior)
        for (const tag of expectedTags) {
            const tagElement = this.tagInCard(taskTitle, tag, columnName);
            await expect(tagElement).toBeVisible({ timeout: 10_000 });
        }

    }
}

module.exports = { BoardPage };