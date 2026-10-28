import { Page, Locator, expect } from '@playwright/test';

/**
 * BasePage - Abstract base class for all Page Objects.
 * Provides common utilities: navigation, waiting, element interactions,
 * assertions, and screenshot helpers.
 */
export abstract class BasePage {
  readonly page: Page;
  readonly url: string;

  constructor(page: Page, url: string = '') {
    this.page = page;
    this.url = url;
  }

  // ─── Navigation ─────────────────────────────────────────────────
  async goto(path?: string): Promise<void> {
    await this.page.goto(path ?? this.url, { waitUntil: 'domcontentloaded' });
  }

  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  async getTitle(): Promise<string> {
    return this.page.title();
  }

  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  // ─── Element Helpers ────────────────────────────────────────────
  async click(locator: Locator): Promise<void> {
    await locator.waitFor({ state: 'visible' });
    await locator.click();
  }

  async fill(locator: Locator, value: string): Promise<void> {
    await locator.waitFor({ state: 'visible' });
    await locator.clear();
    await locator.fill(value);
  }

  async selectOption(locator: Locator, value: string): Promise<void> {
    await locator.waitFor({ state: 'visible' });
    await locator.selectOption(value);
  }

  async getText(locator: Locator): Promise<string> {
    await locator.waitFor({ state: 'visible' });
    return (await locator.textContent()) ?? '';
  }

  async isVisible(locator: Locator): Promise<boolean> {
    return locator.isVisible();
  }

  async isEnabled(locator: Locator): Promise<boolean> {
    return locator.isEnabled();
  }

  async scrollToElement(locator: Locator): Promise<void> {
    await locator.scrollIntoViewIfNeeded();
  }

  async waitForVisible(locator: Locator, timeout = 10_000): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout });
  }

  async waitForHidden(locator: Locator, timeout = 10_000): Promise<void> {
    await locator.waitFor({ state: 'hidden', timeout });
  }

  // ─── Screenshot ─────────────────────────────────────────────────
  async takeScreenshot(name: string): Promise<void> {
    await this.page.screenshot({ path: `test-results/screenshots/${name}.png`, fullPage: true });
  }

  // ─── Toast / Alert Helpers ──────────────────────────────────────
  async getToastMessage(locator: Locator, timeout = 5000): Promise<string> {
    await locator.waitFor({ state: 'visible', timeout });
    return (await locator.textContent()) ?? '';
  }

  // ─── Assertions (DRY wrappers) ──────────────────────────────────
  async assertUrl(expectedUrl: string | RegExp): Promise<void> {
    await expect(this.page).toHaveURL(expectedUrl);
  }

  async assertTitle(expectedTitle: string | RegExp): Promise<void> {
    await expect(this.page).toHaveTitle(expectedTitle);
  }

  async assertVisible(locator: Locator): Promise<void> {
    await expect(locator).toBeVisible();
  }

  async assertText(locator: Locator, expected: string | RegExp): Promise<void> {
    await expect(locator).toHaveText(expected);
  }

  async assertContainsText(locator: Locator, expected: string): Promise<void> {
    await expect(locator).toContainText(expected);
  }

  async assertHidden(locator: Locator): Promise<void> {
    await expect(locator).toBeHidden();
  }
}
