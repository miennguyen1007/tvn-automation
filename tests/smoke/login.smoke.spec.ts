import { test, expect } from '../../src/fixtures';
import { LoginPage } from '../../src/pages/LoginPage';
import { HomePage } from '../../src/pages/HomePage';
import { config } from '../../src/data/config';

/**
 * SMOKE TEST SUITE: Login
 * Purpose: Quick sanity check — verifies the critical happy path is functional.
 * Tag: @smoke @P1
 * Run: npx playwright test tests/smoke --project=smoke:chromium
 */
test.describe('[SMOKE] Login Page', () => {
  let loginPage: LoginPage;
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    homePage = new HomePage(page);
    await loginPage.goto();
  });

  test('TC_SM_001 - Page loads successfully', async ({ page }) => {
    await loginPage.assertUrl(/login|\/$/);
    await loginPage.assertVisible(loginPage.emailInput);
    await loginPage.assertVisible(loginPage.passwordInput);
    await loginPage.assertVisible(loginPage.loginButton);
  });

  test('TC_SM_002 - Successful login with valid credentials', async ({ page }) => {
    await loginPage.loginAndWaitForDashboard(
      config.credentials.user.username,
      config.credentials.user.password,
    );
    const isLoggedIn = await homePage.isLoggedIn();
    expect(isLoggedIn).toBeTruthy();
  });

  test('TC_SM_003 - Login button is enabled', async () => {
    await loginPage.assertVisible(loginPage.loginButton);
    expect(await loginPage.isEnabled(loginPage.loginButton)).toBeTruthy();
  });
});
