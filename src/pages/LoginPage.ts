import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * LoginPage - Page Object Model for Login page
 * URL: https://tvn-sut.info/login (update if different)
 */
export class LoginPage extends BasePage {
  // ─── Locators ───────────────────────────────────────────────────
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly forgotPasswordLink: Locator;
  readonly errorMessage: Locator;
  readonly successMessage: Locator;
  readonly showPasswordToggle: Locator;
  readonly rememberMeCheckbox: Locator;
  readonly pageHeading: Locator;

  constructor(page: Page) {
    super(page, '/login');
    // ⚠️ UPDATE SELECTORS below after inspecting the actual website
    this.emailInput        = page.locator('[data-testid="email-input"], input[type="email"], input[name="email"], #email');
    this.passwordInput     = page.locator('[data-testid="password-input"], input[type="password"], input[name="password"], #password');
    this.loginButton       = page.locator('[data-testid="login-btn"], button[type="submit"], input[type="submit"]').first();
    this.forgotPasswordLink= page.locator('a:has-text("Forgot"), a:has-text("Quên mật khẩu")');
    this.errorMessage      = page.locator('[data-testid="error-msg"], .error-message, .alert-danger, .alert-error');
    this.successMessage    = page.locator('[data-testid="success-msg"], .alert-success, .success-message');
    this.showPasswordToggle= page.locator('[data-testid="show-password"], .toggle-password');
    this.rememberMeCheckbox= page.locator('input[type="checkbox"][name="remember"], #rememberMe');
    this.pageHeading       = page.locator('h1, h2').first();
  }

  // ─── Actions ────────────────────────────────────────────────────

  /**
   * Perform a full login flow.
   */
  async login(email: string, password: string): Promise<void> {
    await this.goto();
    await this.fill(this.emailInput, email);
    await this.fill(this.passwordInput, password);
    await this.click(this.loginButton);
  }

  /**
   * Login and explicitly wait until redirected (post-login URL).
   */
  async loginAndWaitForDashboard(email: string, password: string): Promise<void> {
    await this.login(email, password);
    await this.page.waitForURL(/dashboard|home|\/$/);
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

  async togglePasswordVisibility(): Promise<void> {
    await this.click(this.showPasswordToggle);
  }

  async checkRememberMe(): Promise<void> {
    await this.rememberMeCheckbox.check();
  }
}
