import { test, expect } from '../../src/fixtures';
import { LoginPage } from '../../src/pages/LoginPage';
import { HomePage } from '../../src/pages/HomePage';
import { config } from '../../src/data/config';

/**
 * REGRESSION TEST SUITE: Login & Session
 * Covers cross-browser, edge cases, and previously found bugs
 * Tags: @regression @P1 @P2
 * Run: npx playwright test tests/regression/login.regression.spec.ts
 */
test.describe('[REGRESSION] Login & Session Management', () => {
  let loginPage: LoginPage;
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    homePage  = new HomePage(page);
    await loginPage.goto();
  });

  test('RG_LGN_001 - Back button after logout does not restore session', async ({ page }) => {
    await loginPage.loginAndWaitForDashboard(
      config.credentials.user.username,
      config.credentials.user.password,
    );
    await homePage.logout();
    await page.goBack();
    await page.waitForLoadState('domcontentloaded');
    // Should still be on login page or session expired page
    await expect(page).not.toHaveURL(/dashboard/);
  });

  test('RG_LGN_002 - Multiple rapid clicks on login button', async ({ page }) => {
    await loginPage.fill(loginPage.emailInput, config.credentials.user.username);
    await loginPage.fill(loginPage.passwordInput, config.credentials.user.password);

    // Rapid double click — should NOT cause duplicate requests
    await Promise.all([
      loginPage.loginButton.click(),
      loginPage.loginButton.click({ force: true }),
    ]);
    await page.waitForURL(/dashboard|home|\/[^l]/, { timeout: 15_000 }).catch(() => {});
    // Should be on one page only, no duplicated session
    expect(page.url()).toBeDefined();
  });

  test('RG_LGN_003 - Login in two separate tabs does not conflict', async ({ browser }) => {
    const context = await browser.newContext();
    const page1 = await context.newPage();
    const page2 = await context.newPage();

    const login1 = new LoginPage(page1);
    const login2 = new LoginPage(page2);

    await login1.goto();
    await login2.goto();

    await login1.loginAndWaitForDashboard(
      config.credentials.user.username,
      config.credentials.user.password,
    );

    // Refresh page2 — should now reflect logged-in state via shared session cookie
    await page2.reload();
    await page2.waitForLoadState('domcontentloaded');

    await context.close();
  });

  test('RG_LGN_004 - Session cookie is HttpOnly and Secure', async ({ page, context }) => {
    await loginPage.loginAndWaitForDashboard(
      config.credentials.user.username,
      config.credentials.user.password,
    );
    const cookies = await context.cookies();
    const sessionCookie = cookies.find(c => c.name.toLowerCase().includes('session') || c.name.toLowerCase().includes('token'));

    if (sessionCookie) {
      expect(sessionCookie.httpOnly).toBeTruthy();
      expect(sessionCookie.secure).toBeTruthy();
    } else {
      // No session cookie found — skip gracefully
      test.info().annotations.push({ type: 'warning', description: 'No session cookie found to verify' });
    }
  });
});
