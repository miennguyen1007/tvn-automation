import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * ProductDetailPage - Page Object for Product Detail page
 * URL: https://tvn-sut.info/accessories/:product-slug
 *
 * Selectors verified via live browser inspection on 2026-10-28
 * Fields: qty (number input #field-qty), variant buttons (White/Black/Yellow),
 *         ADD TO CART button, product title h1
 */
export class ProductDetailPage extends BasePage {
  // ─── Locators (REAL selectors) ──────────────────────────────────
  readonly productTitle: Locator;
  readonly qtyInput: Locator;
  readonly addToCartButton: Locator;
  readonly variantButtons: Locator;
  readonly miniCartIcon: Locator;
  readonly breadcrumbHome: Locator;
  readonly breadcrumbCategory: Locator;
  readonly productDescription: Locator;

  constructor(page: Page) {
    super(page, '');
    this.productTitle       = page.locator('h1').first();
    this.qtyInput           = page.locator('#field-qty');
    this.addToCartButton    = page.locator('button:has-text("ADD TO CART")');
    this.variantButtons     = page.locator('button').filter({ hasText: /^(White|Black|Yellow|Green|Blue|Red)$/ });
    this.miniCartIcon       = page.locator('.mini-cart-icon');
    this.breadcrumbHome     = page.locator('a[href="/"]').filter({ hasText: 'Home' });
    this.breadcrumbCategory = page.locator('a[href*="/accessories"]').filter({ hasText: 'Accessories' });
    this.productDescription = page.locator(':has-text("Product Description")').last();
  }

  // ─── Actions ────────────────────────────────────────────────────

  async gotoProduct(slug: string): Promise<void> {
    await this.goto(`/accessories/${slug}`);
  }

  async selectVariant(color: string): Promise<void> {
    await this.page.locator(`button:has-text("${color}")`).click();
  }

  async setQuantity(qty: number): Promise<void> {
    await this.fill(this.qtyInput, String(qty));
  }

  async addToCart(): Promise<void> {
    await this.click(this.addToCartButton);
    // Wait for cart update animation/response
    await this.page.waitForTimeout(1500);
  }

  async addToCartWithOptions(color: string, qty: number = 1): Promise<void> {
    await this.selectVariant(color);
    await this.setQuantity(qty);
    await this.addToCart();
  }

  async getProductTitle(): Promise<string> {
    return this.getText(this.productTitle);
  }

  async isAddToCartEnabled(): Promise<boolean> {
    return this.isEnabled(this.addToCartButton);
  }
}

