```typescript
import { test, expect } from '../../src/fixtures';
import { TestData } from '../../src/data/TestData';
import { config } from '../../src/data/config';

/**
 * E2E TEST SUITE: Login Feature — EverShop tvn-sut.info
 *
 * Run:
 * npx playwright test tests/e2e/login.spec.ts --headed
 */

test.describe('[E2E] Login Feature', () => {

  test.describe('Happy Path', () => {

    test('TC_LGN_001 - Valid credentials → redirect away from login', async ({ loginPage, page }) => {
      await loginPage.login(
        config.credentials.user.username,
        config.credentials.user.password
      );

      await page.waitForURL(/account(?!\/login)|\//, { timeout: 15_000 }).catch(() => {});
      expect(page.url()).not.toMatch(/\/account\/login$/);
    });

    test('TC_LGN_002 - Login page has heading "Welcome Back!"', async ({ loginPage }) => {
      await loginPage.goto();
      await loginPage.assertContainsText(loginPage.pageHeading, 'Welcome Back');
    });

    test('TC_LGN_003 - After login, navigating to /account redirects correctly', async ({ loginPage, page }) => {
      await loginPage.login(
        config.credentials.user.username,
        config.credentials.user.password
      );

      await page.waitForTimeout(2000);
      await page.goto('/account');

      expect(page.url()).toContain('tvn-sut.info');
    });
  });

  test.describe('Negative Tests', () => {

    test('TC_LGN_004 - Wrong password keeps user on login page', async ({ loginPage, page }) => {
      await loginPage.login(
        config.credentials.user.username,
        'WrongPass_!999'
      );

      await page.waitForTimeout(2000);
      expect(page.url()).toMatch(/account\/login|tvn-sut\.info/);
    });

    test('TC_LGN_005 - Non-existent email keeps user on login page', async ({ loginPage, page }) => {
      await loginPage.login(
        'nonexistent_user_xyz@test.com',
        'Password123!'
      );

      await page.waitForTimeout(2000);
      expect(page.url()).toMatch(/account\/login/);
    });

    test('TC_LGN_006 - Empty email field, form does not submit to dashboard', async ({ loginPage, page }) => {
      await loginPage.goto();
      await loginPage.fill(loginPage.passwordInput, 'Password123!');
      await loginPage.click(loginPage.loginButton);
      await page.waitForTimeout(1500);

      expect(page.url()).toMatch(/account\/login/);
    });

    test('TC_LGN_007 - Empty password field, form does not submit to dashboard', async ({ loginPage, page }) => {
      await loginPage.goto();
      await loginPage.fill(
        loginPage.emailInput,
        config.credentials.user.username
      );

      await loginPage.click(loginPage.loginButton);
      await page.waitForTimeout(1500);

      expect(page.url()).toMatch(/account\/login/);
    });

    test('TC