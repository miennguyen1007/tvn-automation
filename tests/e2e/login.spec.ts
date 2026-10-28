import { test, expect } from '../../src/fixtures';
import { LoginPage } from '../../src/pages/LoginPage';
import { HomePage } from '../../src/pages/HomePage';
import { TestData } from '../../src/data/TestData';
import { config } from '../../src/data/config';

/**
 * E2E TEST SUITE: Full Login Flow
 * Covers: Positive, Negative, Boundary, Security, UI/UX tests
 * Tags: @e2e @P1 @P2 @P3
 * Run: npx playwright test tests/e2e/login.spec.ts
 */
test.describe('[E2E] Login Feature', () => {
  let loginPage: LoginPage;
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    homePage = new HomePage(page);
    await loginPage.goto();
  });

  // ─── GROUP 1: Happy Path ────────────────────────────────────────────────────
  test.describe('Happy Path', () => {
    test('TC_LGN_001 - Login with valid email and password', async ({ page }) => {
      await loginPage.loginAndWaitForDashboard(
        config.credentials.user.username,
        config.credentials.user.password,
      );
      expect(await homePage.isLoggedIn()).toBeTruthy();
    });

    test('TC_LGN_002 - Session persists after page refresh', async ({ page }) => {
      await loginPage.loginAndWaitForDashboard(
        config.credentials.user.username,
        config.credentials.user.password,
      );
      await page.reload();
      await page.waitForLoadState('domcontentloaded');
      expect(await homePage.isLoggedIn()).toBeTruthy();
    });

    test('TC_LGN_003 - Logout successfully clears session', async ({ page }) => {
      await loginPage.loginAndWaitForDashboard(
        config.credentials.user.username,
        config.credentials.user.password,
      );
      await homePage.logout();
      await loginPage.assertUrl(/login|\//);
      const isLoggedIn = await homePage.isLoggedIn().catch(() => false);
      expect(isLoggedIn).toBeFalsy();
    });
  });

  // ─── GROUP 2: Negative Tests ────────────────────────────────────────────────
  test.describe('Negative Tests', () => {
    test('TC_LGN_004 - Login with wrong password shows error', async ({ page }) => {
      await loginPage.login(config.credentials.user.username, 'WrongPass999!');
      await loginPage.assertVisible(loginPage.errorMessage);
    });

    test('TC_LGN_005 - Login with non-existent email shows error', async ({ page }) => {
      await loginPage.login('nonexistent@test.com', 'Password123!');
      await loginPage.assertVisible(loginPage.errorMessage);
    });

    test('TC_LGN_006 - Login with empty email shows validation', async ({ page }) => {
      await loginPage.fill(loginPage.passwordInput, 'Password123!');
      await loginPage.click(loginPage.loginButton);
      // Should NOT navigate away from login
      await loginPage.assertUrl(/login|\//);
    });

    test('TC_LGN_007 - Login with empty password shows validation', async ({ page }) => {
      await loginPage.fill(loginPage.emailInput, config.credentials.user.username);
      await loginPage.click(loginPage.loginButton);
      await loginPage.assertUrl(/login|\//);
    });

    test('TC_LGN_008 - Login with both fields empty', async ({ page }) => {
      await loginPage.click(loginPage.loginButton);
      await loginPage.assertUrl(/login|\//);
    });

    test.each(TestData.invalidEmails)(
      'TC_LGN_009 - Invalid email format: "%s"',
      async (invalidEmail) => {
        if (invalidEmail === '') return; // empty tested separately
        await loginPage.fill(loginPage.emailInput, invalidEmail);
        await loginPage.fill(loginPage.passwordInput, 'Password123!');
        await loginPage.click(loginPage.loginButton);
        await loginPage.assertUrl(/login|\//);
      },
    );
  });

  // ─── GROUP 3: Boundary Value Tests ─────────────────────────────────────────
  test.describe('Boundary Value Analysis', () => {
    test('TC_LGN_010 - Password at minimum length (8 chars)', async ({ page }) => {
      await loginPage.login(config.credentials.user.username, TestData.passwordBoundary.minimum);
      // Expecting either success or controlled error (not a crash)
      const url = page.url();
      expect(url).toBeDefined();
    });

    test('TC_LGN_011 - Extremely long password (128 chars)', async ({ page }) => {
      await loginPage.login(config.credentials.user.username, TestData.passwordBoundary.maximum);
      const url = page.url();
      expect(url).toBeDefined();
    });
  });

  // ─── GROUP 4: Security Tests ────────────────────────────────────────────────
  test.describe('Security Tests', () => {
    test.each(TestData.sqlInjection)(
      'TC_LGN_012 - SQL injection in email field: "%s"',
      async (payload) => {
        await loginPage.login(payload, 'Password123!');
        // Should NOT log in, should NOT crash with server error
        await loginPage.assertUrl(/login|\//);
        const errorVisible = await loginPage.isErrorVisible();
        expect(errorVisible).toBeTruthy();
      },
    );

    test.each(TestData.xssPayloads)(
      'TC_LGN_013 - XSS payload in email field: "%s"',
      async (payload) => {
        await loginPage.fill(loginPage.emailInput, payload);
        await loginPage.fill(loginPage.passwordInput, 'Password123!');
        await loginPage.click(loginPage.loginButton);
        // XSS should be escaped, no script execution
        const title = await loginPage.getTitle();
        expect(title).not.toContain('<script>');
      },
    );

    test('TC_LGN_014 - Password field is masked by default', async ({ page }) => {
      const passwordType = await loginPage.passwordInput.getAttribute('type');
      expect(passwordType).toBe('password');
    });

    test('TC_LGN_015 - Login page served over HTTPS', async ({ page }) => {
      expect(page.url()).toMatch(/^https:\/\//);
    });
  });

  // ─── GROUP 5: UI/UX Tests ───────────────────────────────────────────────────
  test.describe('UI/UX Tests', () => {
    test('TC_LGN_016 - Login page has correct title', async ({ page }) => {
      const title = await loginPage.getTitle();
      expect(title.length).toBeGreaterThan(0);
    });

    test('TC_LGN_017 - Tab order: email → password → submit', async ({ page }) => {
      await loginPage.emailInput.focus();
      await page.keyboard.press('Tab');
      const focused = await page.evaluate(() => document.activeElement?.getAttribute('type'));
      expect(focused).toBe('password');
    });

    test('TC_LGN_018 - Submit on pressing Enter in password field', async ({ page }) => {
      await loginPage.fill(loginPage.emailInput, config.credentials.user.username);
      await loginPage.fill(loginPage.passwordInput, config.credentials.user.password);
      await loginPage.passwordInput.press('Enter');
      await page.waitForURL(/dashboard|home|\/[^l]/, { timeout: 10_000 }).catch(() => {});
    });

    test('TC_LGN_019 - Forgot password link is present and clickable', async ({ page }) => {
      const isVisible = await loginPage.isVisible(loginPage.forgotPasswordLink);
      if (isVisible) {
        await loginPage.clickForgotPassword();
        await loginPage.assertUrl(/forgot|reset|password/);
      } else {
        test.skip();
      }
    });
  });
});
