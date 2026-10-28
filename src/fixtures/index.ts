import { test as base, Page, BrowserContext } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { HomePage } from '../pages/HomePage';
import { config } from '../data/config';

/**
 * Custom Fixtures — extend Playwright's base `test` with pre-built page objects
 * and authenticated contexts, so tests stay clean and DRY.
 */
export type Fixtures = {
  loginPage:    LoginPage;
  homePage:     HomePage;
  authContext:  BrowserContext;   // Pre-authenticated browser context
};

export const test = base.extend<Fixtures>({
  /**
   * Provides a fresh LoginPage instance for each test
   */
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  /**
   * Provides a fresh HomePage instance for each test
   */
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },

  /**
   * Provides a browser context that is already authenticated.
   * Uses stored session state from auth.setup.ts
   */
  authContext: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: 'playwright/.auth/user.json',
    });
    await use(context);
    await context.close();
  },
});

export { expect } from '@playwright/test';
