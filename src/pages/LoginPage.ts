import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * LoginPage - Page Object Model for Login page
 * URL: https://tvn-sut.info/account/login
 *
 * Selectors verified via live browser inspection on 2026-10-28
 */
export class LoginPage extends BasePage {
  // ─── Locators (REAL selectors from live site) ───────────────────
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly forgotPasswordLink: Locator;
  readonly createAccountLink: Locator;
  readonly errorMessage: Locator;
  readonly pageHeading: Locator;

  constructor(page: Page) {
    super(page, '/account/login');
    // Verified selectors from live site inspection
    this.emailInput         = page.locator('#field-email');
    this.passwordInput      = page.locator('#field-password');
    this.loginButton        = page.locator('button:has-text("Sign In")');
    this.forgotPasswordLink = page.locator('a[href*="reset-password"]');
    this.createAccountLink  = page.locator('a[href*="register"]');
    this.errorMessage       = page.locator('.error-message, [class*="error"], [class*="alert"], [role="alert"]');
    this.pageHeading        = page.locator('h1, h2').filter({ hasText: 'Welcome Back' });
  }

  // ─── Actions ────────────────────────────────────────────────────

  /** Fill credentials and submit */
  async login(email: string, password: string): Promise<void> {
    await this.goto();
    await this.fill(this.emailInput, email);
    await this.fill(this.passwordInput, password);
    await this.click(this.loginButton);
  }

  /** Login and wait for redirect to account/home page */
  async loginAndWaitForRedirect(email: string, password: string): Promise<void> {
    await this.login(email, password);
    await this.page.waitForURL(/account(?!\/login)|\//, { timeout: 15_000 });
  }

  async getErrorMessage(): Promise<string> {
    return this.getText(this.errorMessage);
  }

  async isErrorVisible(): Promise<boolean> {
    return this.isVisible(this.errorMessage);
  }

  async clickForgotPassword(): Promise<void> {
    await this.click(this.forgotPasswordLink);
  }

  async clickCreateAccount(): Promise<void> {
    await this.click(this.createAccountLink);
  }
}

