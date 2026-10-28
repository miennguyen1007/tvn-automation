import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';

dotenv.config();

const BASE_URL = process.env.BASE_URL || 'https://tvn-sut.info';
const HEADLESS = process.env.HEADLESS !== 'false';

export default defineConfig({
  // ─── Test directory ───────────────────────────────────────────
  testDir: './tests',
  testMatch: '**/*.spec.ts',

  // ─── Global settings ──────────────────────────────────────────
  timeout: 60_000,
  expect: {
    timeout: 10_000,
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : 4,

  // ─── Reporter ─────────────────────────────────────────────────
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['allure-playwright', { outputFolder: 'allure-results', detail: true }],
    ['junit', { outputFile: 'test-results/junit-report.xml' }],
  ],

  // ─── Global test setup ────────────────────────────────────────
  use: {
    baseURL: BASE_URL,
    headless: HEADLESS,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
    locale: 'vi-VN',
    timezoneId: 'Asia/Ho_Chi_Minh',
    viewport: { width: 1440, height: 900 },
  },

  // ─── Projects (browsers) ──────────────────────────────────────
  projects: [
    // --- Setup project (global auth) ---
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },

    // --- Smoke Tests (Chromium) ---
    {
      name: 'smoke:chromium',
      testMatch: /smoke\/.+\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
      dependencies: ['setup'],
    },

    // --- E2E Tests (Chromium) ---
    {
      name: 'e2e:chromium',
      testMatch: /e2e\/.+\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
      dependencies: ['setup'],
    },

    // --- Regression Tests (Multi-browser) ---
    {
      name: 'regression:chromium',
      testMatch: /regression\/.+\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
      dependencies: ['setup'],
    },
    {
      name: 'regression:firefox',
      testMatch: /regression\/.+\.spec\.ts/,
      use: { ...devices['Desktop Firefox'] },
      dependencies: ['setup'],
    },
    {
      name: 'regression:webkit',
      testMatch: /regression\/.+\.spec\.ts/,
      use: { ...devices['Desktop Safari'] },
      dependencies: ['setup'],
    },

    // --- Mobile Responsive Tests ---
    {
      name: 'mobile:chrome',
      testMatch: /e2e\/.+\.spec\.ts/,
      use: { ...devices['Pixel 7'] },
      dependencies: ['setup'],
    },
  ],
});
