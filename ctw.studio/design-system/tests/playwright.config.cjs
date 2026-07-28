const { defineConfig } = require("@playwright/test");
const { join, resolve } = require("node:path");

const here = __dirname;
const designDir = resolve(here, "..");
const rootDir = resolve(here, "../../..");
const outputRoot = join(designDir, "test-results");
const outputDir = join(outputRoot, "results");

module.exports = defineConfig({
  testDir: here,
  testMatch: "guide.visual.spec.cjs",
  outputDir,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: [
    ["line"],
    ["html", { outputFolder: join(outputRoot, "report"), open: "never" }],
  ],
  use: {
    baseURL: "http://127.0.0.1:4173",
    locale: "en-GB",
    timezoneId: "Europe/Amsterdam",
    reducedMotion: "reduce",
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { browserName: "chromium" } }],
  webServer: {
    command: "python3 -m http.server 4173 --directory ctw.studio --bind 127.0.0.1",
    cwd: rootDir,
    url: "http://127.0.0.1:4173/design-system/",
    reuseExistingServer: !process.env.CI,
  },
});
