import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * HomePage - Page Object for EverShop homepage
 * URL: https://tvn-sut.info/
 *
 * Selectors verified via live browser inspection on 2026-10-28
 * Features: Hero section, Featured products, Navigation (Shop, About us)
 */
export class HomePage extends BasePage {
  // ─── Locators (REAL selectors) ──────────────────────────────────
  readonly heroHeading: Locator;
  readonly shopButton: Locator;
  readonly viewCollectionLink: Locator;
  readonly featuredProductsSection: Locator;
  readonly featuredProductCards: Locator;
  readonly aboutUsLink: Locator;
  readonly miniCartIcon: Locator;
  readonly loginLink: Locator;

  constructor(page: Page) {
    super(page, '/');
    // Verified selectors from live inspection
    this.heroHeading            = page.locator('h1, h2').filter({ hasText: 'Crafted With Care' }).first();
    this.shopButton             = page.locator('button:has-text("Shop")');
    this.viewCollectionLink     = page.locator('a:has-text("View Collection")').first();
    this.featuredProductsSection= page.locator('h2').filter({ hasText: 'FEATURED PRODUCTS' });
    this.featuredProductCards   = page.locator('a[href*="/accessories/stainless-steel"], a[href*="/accessories/modern-ceramic"]');
    this.aboutUsLink            = page.locator('a[href*="page/about-us"]');
    this.miniCartIcon           = page.locator('.mini-cart-icon');
    this.loginLink              = page.locator('a[href*="/account/login"]');
  }

  // ─── Actions ────────────────────────────────────────────────────

  async clickShop(): Promise<void> {
    // "Shop" button opens a dropdown — click the /accessories link inside it
    await this.click(this.shopButton);
    await this.page.waitForTimeout(500);
    const accessoriesLink = this.page.locator('a[href*="/accessories"]').first();
    if (await accessoriesLink.isVisible()) {
      await accessoriesLink.click();
    }
    await this.page.waitForURL(/accessories/, { timeout: 10_000 });
  }

  async clickViewCollection(): Promise<void> {
    await this.click(this.viewCollectionLink);
    await this.page.waitForURL(/accessories/, { timeout: 10_000 });
  }

  async clickAboutUs(): Promise<void> {
    await this.click(this.aboutUsLink);
    await this.page.waitForURL(/about-us/, { timeout: 10_000 });
  }

  async clickLoginLink(): Promise<void> {
    await this.click(this.loginLink);
    await this.page.waitForURL(/account\/login/, { timeout: 10_000 });
  }

  async getFeaturedProductCount(): Promise<number> {
    return this.featuredProductCards.count();
  }
}

