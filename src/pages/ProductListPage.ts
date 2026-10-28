import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * ProductListPage - Page Object for Product Listing page
 * URL: https://tvn-sut.info/accessories
 *
 * Selectors verified via live browser inspection on 2026-10-28
 * Features: Price range filter (range inputs), Color filter (checkboxes),
 *           Product cards with names and prices
 */
export class ProductListPage extends BasePage {
  // ─── Locators (REAL selectors) ──────────────────────────────────
  readonly pageHeading: Locator;
  readonly productCards: Locator;
  readonly productNames: Locator;
  readonly productPrices: Locator;
  readonly priceRangeMin: Locator;
  readonly priceRangeMax: Locator;
  readonly colorFilterYellow: Locator;
  readonly colorFilterBlack: Locator;
  readonly colorFilterWhite: Locator;
  readonly loginLink: Locator;

  constructor(page: Page) {
    super(page, '/accessories');
    this.pageHeading       = page.locator('h1').first();
    // Product cards — EverShop renders as anchor links containing product info
    this.productCards      = page.locator('a[href*="/accessories/"]').filter({ hasNot: page.locator('[class*="nav"]') });
    this.productNames      = page.locator('a[href*="/accessories/"] h3, a[href*="/accessories/"] [class*="name"], a[href*="/accessories/"] [class*="title"]');
    this.productPrices     = page.locator('[class*="price"], [class*="Price"]');
    // Price range sliders — id="base-ui-10" (min) and id="base-ui-13" (max)
    this.priceRangeMin     = page.locator('#base-ui-10');
    this.priceRangeMax     = page.locator('#base-ui-13');
    // Color filter checkboxes — id="color-1", "color-2", etc.
    this.colorFilterYellow = page.locator('#color-1');
    this.colorFilterBlack  = page.locator('#color-2');
    this.colorFilterWhite  = page.locator('#color-3');
    this.loginLink         = page.locator('a[href*="/account/login"]');
  }

  // ─── Actions ────────────────────────────────────────────────────

  async getProductCount(): Promise<number> {
    return this.productCards.count();
  }

  async clickProductByIndex(index: number): Promise<void> {
    await this.productCards.nth(index).click();
  }

  async clickProductByName(name: string): Promise<void> {
    await this.page.locator(`a[href*="/accessories/"]:has-text("${name}")`).first().click();
  }

  async filterByColor(colorId: string): Promise<void> {
    await this.page.locator(`#${colorId}`).check();
    await this.page.waitForLoadState('networkidle');
  }

  async getAllProductNames(): Promise<string[]> {
    return this.page.$$eval('a[href*="/accessories/"]', els =>
      els.map(e => e.textContent?.trim() ?? '').filter(t => t.length > 0)
    );
  }
}

