import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  use: {
    baseURL: 'https://denunciastremio.netlify.app',
    headless: true,
    viewport: { width: 1280, height: 720 },
  },
  timeout: 30000,
  retries: 1,
});
