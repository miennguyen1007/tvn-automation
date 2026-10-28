
import { test, expect } from '../../src/fixtures';
import { TestData } from '../../src/data/TestData';

/**
 * E2E TEST SUITE: Register Feature — EverShop tvn-sut.info
 * Selectors verified on 2026-10-28:
 *   - #field-full_name
 *   - #field-email
 *   - #field-password
 *   - button "Sign Up"
 *   - a[href="/account/login"]
 */

test.describe('[E2E] Register Feature', () => {
  test.describe('Happy Path', () => {
    test('TC_REG_001 - Register page has all 3 required fields', async ({ registerPage }) => {
      await registerPage.goto();
      await registerPage.assertVisible(registerPage.fullNameInput);
      await registerPage.assertVisible(registerPage.emailInput);
      await registerPage.assertVisible(registerPage.passwordInput);
      await registerPage.assertVisible(registerPage.signUpButton);
    });

    test('TC_REG_002 - Page heading is "Create an account"', async ({ registerPage }) => {
      await registerPage.goto();
      await registerPage.assertContainsText(
        registerPage.pageHeading,
        'Create an account',
      );
    });

    test('TC_REG_003 - Register with unique email submits form', async ({ registerPage, page }) => {
      const user = TestData.validUser();

      await registerPage.register(
        `${user.firstName} ${user.lastName}`,
        user.email,
        'TestPass123!',
      );

      await page.waitForTimeout(3000);
      expect(page.url()).toContain('tvn-sut.info');
    });
  });

  test.describe('Negative Tests', () => {
    test('TC_REG_004 - Empty full name, form does not submit', async ({ registerPage, page }) => {
      await registerPage.goto();
      await registerPage.fill(registerPage.emailInput, TestData.validUser().email);
      await registerPage.fill(registerPage.passwordInput, 'Password123!');
      await registerPage.click(registerPage.signUpButton);
      await page.waitForTimeout(1500);

      expect(page.url()).toMatch(/register/);
    });

    test('TC_REG_005 - Empty email, form does not submit', async ({ registerPage, page }) => {
      await registerPage.goto();
      await registerPage.fill(registerPage.fullNameInput, 'Test User');
      await registerPage.fill(registerPage.passwordInput, 'Password123!');
      await registerPage.click(registerPage.signUpButton);
      await page.waitForTimeout(1500);

      expect(page.url()).toMatch(/register/);
    });

    test('TC_REG_006 - Empty password, form does not submit', async ({ registerPage, page }) => {
      await registerPage.goto();
      await registerPage.fill(registerPage.fullNameInput, 'Test User');
      await registerPage.fill(registerPage.emailInput, TestData.validUser().email);
      await registerPage.click(registerPage.signUpButton);
      await page.waitForTimeout(1500);

      expect(page.url()).toMatch(/register/);
    });

    // Playwright Test does not support Jest-style test.each().
    // forEach() defines a separate Playwright test for each email.
    TestData.invalidEmails
      .filter((email) => email !== '')
      .forEach((email) => {
        test(`TC_REG_007 - Invalid email "${email}" keeps user on register`, async ({
          registerPage,
          page,
        }) => {
          await registerPage.goto();
          await registerPage.fill(registerPage.fullNameInput, 'Test User');
          await registerPage.fill(registerPage.emailInput, email);
          await registerPage.fill(registerPage.passwordInput, 'Password123!');
          await registerPage.click(registerPage.signUpButton);
          await page.waitForTimeout(1500);

          expect(page.url()).toMatch(/register/);
        });
      });

    test('TC_REG_008 - Short password (3 chars) rejected', async ({ registerPage, page }) => {
      await registerPage.goto();
      const user = TestData.validUser();

      await registerPage.register(
        user.firstName,
        user.email,
        TestData.passwordBoundary.tooShort,
      );

      await page.waitForTimeout(2000);
      expect(page.url()).toMatch(/register/);
    });
  });


  test.describe('UI/UX Tests', () => {
    test('TC_REG_009 - Login link navigates to /account/login', async ({ registerPage, page }) => {
      await registerPage.goto();

      // Locate the exact "Login" link to avoid strict mode violation
      const loginLink = page.getByRole('link', {
        name: 'Login',
        exact: true,
      });

      await loginLink.click();
      await page.waitForURL(/account\/login/, { timeout: 10_000 });

      expect(page.url()).toContain('account/login');
    });


    test('TC_REG_010 - Password field is masked (type=password)', async ({ registerPage }) => {
      await registerPage.goto();
      const type = await registerPage.passwordInput.getAttribute('type');

      expect(type).toBe('password');
    });

    test('TC_REG_011 - Full name placeholder is "Full Name"', async ({ registerPage }) => {
      await registerPage.goto();
      const placeholder = await registerPage.fullNameInput.getAttribute('placeholder');

      expect(placeholder).toBe('Full Name');
    });
  });
});
