import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/qa',
  fullyParallel: false,
  retries: 1,
  timeout: 30_000,
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['json', { outputFile: 'playwright-report/results.json' }],
  ],
  use: {
    baseURL: 'http://localhost:1313',
    headless: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    locale: 'pt-PT',
    timezoneId: 'Europe/Lisbon',
  },
  projects: [
    { name: 'Desktop Chrome', use: { ...devices['Desktop Chrome'] } },
    { name: 'Mobile Safari',  use: { ...devices['iPhone 14'] } },
    { name: 'Mobile Chrome',  use: { ...devices['Pixel 7'] } },
  ],
  webServer: {
    command: 'hugo server --disableFastRender --port 1313',
    url: 'http://localhost:1313',
    reuseExistingServer: true,
    timeout: 30_000,
  },
});
