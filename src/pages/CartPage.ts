import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * CartPage - Page Object for Shopping Cart page
 * URL: https://tvn-sut.info/cart
 *
 * Selectors verified via live browser inspection on 2026-10-28
 * Note: Cart is session-based, items stored server-side per session cookie.
 */
export class CartPage extends BasePage {
  // ─── Locators (REAL selectors) ──────────────────────────────────
  readonly pageHeading: Locator;
  readonly emptyCartMessage: Locator;
  readonly continueShoppingButton: Locator;
  readonly checkoutButton: Locator;
  readonly cartItems: Locator;
  readonly miniCartIcon: Locator;

  constructor(page: Page) {
    super(page, '/cart');
    this.pageHeading             = page.locator('h1, h2').filter({ hasText: 'Shopping cart' });
    this.emptyCartMessage        = page.locator(':has-text("Your cart is empty")');
    this.continueShoppingButton  = page.locator('button:has-text("CONTINUE SHOPPING")');
    this.checkoutButton          = page.locator('a:has-text("CHECKOUT"), button:has-text("CHECKOUT"), a:has-text("Checkout")');
    this.cartItems               = page.locator('[class*="cart-item"], [class*="CartItem"], tbody tr');
    this.miniCartIcon            = page.locator('.mini-cart-icon');
  }

  // ─── Actions ────────────────────────────────────────────────────

  async isCartEmpty(): Promise<boolean> {
    return this.isVisible(this.emptyCartMessage);
  }

  async getCartItemCount(): Promise<number> {
    if (await this.isCartEmpty()) return 0;
    return this.cartItems.count();
  }

  async continueShopping(): Promise<void> {
    await this.click(this.continueShoppingButton);
  }

  async proceedToCheckout(): Promise<void> {
    await this.click(this.checkoutButton);
    await this.page.waitForURL(/checkout/, { timeout: 15_000 });
  }
}

