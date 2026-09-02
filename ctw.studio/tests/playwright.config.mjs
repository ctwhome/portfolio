import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: '.',
  testMatch: ['e2e/**/*.spec.mjs', 'visual/**/*.spec.mjs'],
  fullyParallel: false,
  retries: 0,
  reporter: 'line',
  use: {
    baseURL: 'http://127.0.0.1:55035',
    trace: 'retain-on-failure'
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } }
  ],
  webServer: {
    command: 'bun run preview:test -- --host 127.0.0.1 --port 55035',
    url: 'http://127.0.0.1:55035/',
    reuseExistingServer: false,
    timeout: 30_000
  }
});
