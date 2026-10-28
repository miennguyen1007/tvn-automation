import { test as setup, expect } from '@playwright/test';
import { LoginPage } from '../src/pages/LoginPage';
import { config } from '../src/data/config';
import * as fs from 'fs';

/**
 * Auth Setup — runs ONCE before test suites.
 * Logs in and saves the authenticated session state to a file.
 * All tests that depend on 'setup' project will reuse this session.
 */
const authFile = 'playwright/.auth/user.json';

setup('Authenticate as standard user', async ({ page }) => {
  // Ensure auth directory exists
  fs.mkdirSync('playwright/.auth', { recursive: true });

  const loginPage = new LoginPage(page);
  await loginPage.goto();

  // ⚠️ Replace with actual credentials from .env
  await loginPage.login(
    config.credentials.user.username,
    config.credentials.user.password,
  );

  // Wait until login is confirmed (adapt the URL pattern to the actual app)
  await page.waitForURL(/dashboard|home|\/$/, { timeout: 30_000 });

  // Assert that the user is actually logged in
  await expect(page).not.toHaveURL(/login/);

  // Save session to disk
  await page.context().storageState({ path: authFile });
});
