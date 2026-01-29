const { expect } = require("@playwright/test");

class BoardPage {
    /**
    * @param {import('@playwright/test').Page} page
    */
    constructor(page) {
        this.page = page
    }

    appNavItem(appName) {
        return this.page.locator(`xpath=//button/h2[contains(text(),"${appName}")]`);
    }
    columnContainer(columnName) {
        return this.page.locator(`xpath=//div/h2[contains(text(),"${columnName}")]/ancestor::div`);
    }
    // A version of columnContainer that returns a raw XPath string for composing
    columnContainerXPath(columnName) {
        return `//*[self::h1 or self::h2 or self::h3 or self::h4 or self::div or self::span]
            [normalize-space()='${columnName}']
            /ancestor::*[self::section or self::div][1]`;
    }
    // Tag within a task card (exact match)
    tagInCard(cardLocator, tagText) {
        // Search within the card for an element that equals the tag text
        // (tag could be span/div/badge/etc.)
        return cardLocator.locator(`xpath=.//*[self::span or self::div or self::p][normalize-space()='${tagText}']`);
    }
    // Task/card inside a given column by exact title text
    taskCardInColumn(columnName, taskTitle) {
        return this.page.locator(`xpath=(${this.columnContainerXPath(columnName)}//*[self::div or self::p or self::span or self::h4 or self::h5][normalize-space()='${taskTitle}']/ancestor::*[self::article or self::li or self::div or self::section][1])`);
    }
    async openApp(appName) {
        const navItem = this.appNavItem(appName);
        await expect(navItem).toBeVisible({ timeout: 10_000 });
        await navItem.click();

        // Wait for board to render: columns should appear
        // If your UI always has these columns, this is a great stabilization point.
        const anyColumnHeader = this.page.locator(`xpath=//*[normalize-space()='To Do' or normalize-space()='In Progress' or normalize-space()='Done']`);
        await expect(anyColumnHeader).toBeVisible({ timeout: 10_000 });
    }

    async assertTaskInColumn({ columnName, taskTitle, expectedTags }) {
        // Verify the column exists
        const column = this.page.locator(`xpath=${this.columnContainerXPath(columnName)}`);
        await expect(column).toBeVisible({ timeout: 10_000 });

        // Verify the task exists in that column
        const card = this.taskCardInColumn(columnName, taskTitle);
        await expect(card).toBeVisible({ timeout: 10_000 });

        // Verify tags (contains-all behavior)
        for (const tag of expectedTags) {
            const tagEl = this.tagInCard(card, tag);
            await expect(tagEl).toBeVisible({ timeout: 10_000 });
        }

    }
}

module.exports = { BoardPage };