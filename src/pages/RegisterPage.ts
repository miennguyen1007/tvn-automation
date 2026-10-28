import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * RegisterPage - Page Object for Registration page
 * URL: https://tvn-sut.info/account/register
 *
 * Selectors verified via live browser inspection on 2026-10-28
 * Fields: full_name, email, password | Button: "Sign Up"
 */
export class RegisterPage extends BasePage {
  // ─── Locators (REAL selectors) ──────────────────────────────────
  readonly fullNameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly signUpButton: Locator;
  readonly loginLink: Locator;
  readonly errorMessage: Locator;
  readonly pageHeading: Locator;

  constructor(page: Page) {
    super(page, '/account/register');
    this.fullNameInput  = page.locator('#field-full_name');
    this.emailInput     = page.locator('#field-email');
    this.passwordInput  = page.locator('#field-password');
    this.signUpButton   = page.locator('button:has-text("Sign Up")');
    this.loginLink      = page.locator('a[href*="/account/login"]');
    this.errorMessage   = page.locator('[class*="error"], [role="alert"]');
    this.pageHeading    = page.locator('h1, h2').filter({ hasText: 'Create an account' });
  }

  // ─── Actions ────────────────────────────────────────────────────

  async register(fullName: string, email: string, password: string): Promise<void> {
    await this.goto();
    await this.fill(this.fullNameInput, fullName);
    await this.fill(this.emailInput, email);
    await this.fill(this.passwordInput, password);
    await this.click(this.signUpButton);
  }

  async registerAndWaitForRedirect(fullName: string, email: string, password: string): Promise<void> {
    await this.register(fullName, email, password);
    await this.page.waitForURL(/account(?!\/register)/, { timeout: 15_000 });
  }

  async clickLoginLink(): Promise<void> {
    await this.click(this.loginLink);
  }

  async isErrorVisible(): Promise<boolean> {
    return this.isVisible(this.errorMessage);
  }
}

