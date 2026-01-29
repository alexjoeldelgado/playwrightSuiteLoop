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
    // You can also put baseURL here if you want, but since you're reading it from JSON
    // it’s fine to leave this out.
    // baseURL: "https://animated-gingersnap-8cf7f2.netlify.app/",

    headless: true,

    // Good defaults for stability
    actionTimeout: 10_000,
    navigationTimeout: 20_000,

    // Helpful artifacts
    screenshot: "only-on-failure",
    trace: "on-first-retry",
    video: "retain-on-failure",

    // If the app is sensitive to viewport changes, pin it
    viewport: { width: 1280, height: 720 },

    // If you want to see the browser locally sometimes:
    // headless: false,
    // launchOptions: { slowMo: 100 },
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    }
  ],

  // Put all test artifacts here (screenshots, videos, traces)
  outputDir: "test-results",
});
