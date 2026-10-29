import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',

  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  reporter: 'html',

  use: {
    headless: false,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: {
        browserName: 'chromium',
        viewport: null,          // <- let the window decide the size
        launchOptions: {
          args: ['--start-maximized'],
        },
      },
    },

    {
      name: 'firefox',
      use: {
        browserName: 'firefox',
        viewport: null,
        launchOptions: {
          args: ['--kiosk'],     // Firefox has no --start-maximized
        },
      },
    },

    {
      name: 'webkit',
      use: {
        browserName: 'webkit',
        viewport: null,
      },
    },
  ],
});
