import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests',
  testMatch: '**/*.spec.ts',
  fullyParallel: false,
  workers: 1,
  timeout: 60000,
  use: { baseURL: 'http://127.0.0.1:5174', viewport: { width: 1440, height: 1000 }, headless: true,
    launchOptions: { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE, args: process.env.PLAYWRIGHT_USE_METAL === '1' ? ['--use-gl=angle', '--use-angle=metal', '--enable-gpu'] : [] } },
  webServer: { command: 'npm run dev -- --port 5174', url: 'http://127.0.0.1:5174', reuseExistingServer: !process.env.CI },
});
