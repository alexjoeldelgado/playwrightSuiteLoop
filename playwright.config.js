const { defineConfig, devices } = require("@playwright/test");

module.exports = defineConfig({
  testDir: "./tests",
  timeout: 30_000,
  expect: {
    timeout: 10_000,
  },

  // Run tests in files in parallel; can be set to false if the demo app is flaky
  fullyParallel: true,

  // Fail the build on accidental .only in CI
  forbidOnly: !!process.env.CI,

  // Retry in CI to reduce flakiness noise
  retries: process.env.CI ? 2 : 0,

  // Keep workers conservative in CI
  workers: process.env.CI ? 1 : undefined,

  reporter: [
    ["list"],
    ["html", { open: "never" }],
  ],

  use: {
    // runs without browser open
    headless: true,

    // Good defaults for stability
    actionTimeout: 10_000,
    navigationTimeout: 20_000,

    // Helpful artifacts
    screenshot: "only-on-failure",
    trace: "on-first-retry",
    video: "retain-on-failure",

    // Standard viewport for testing
    viewport: { width: 1280, height: 720 },
  },

  // At the moment only tested in Chrome, but other browsers would be added here
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    }
  ],

  // Put all test artifacts here (screenshots, videos, traces)
  outputDir: "test-results",
});
