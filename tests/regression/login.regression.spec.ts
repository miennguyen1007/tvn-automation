import { test, expect } from '../../src/fixtures';

/**
 * REGRESSION TEST SUITE — EverShop tvn-sut.info
 * Tests previously-discovered edge cases and cross-page navigation flows.
 * Selectors VERIFIED on 2026-10-28.
 */
test.describe('[REGRESSION] Cross-page Navigation & Edge Cases', () => {

  test('RG_001 - Logo/Home link navigates back to homepage', async ({ productListPage, page }) => {
    await productListPage.goto();
    const homeLink = page.locator('a[href="/"]').first();
    await homeLink.click();
    await page.waitForURL(/tvn-sut\.info\/$/, { timeout: 10_000 });
    await expect(page).toHaveTitle('EverShop');
  });

  test('RG_002 - "About us" navigation link works from homepage', async ({ homePage, page }) => {
    await homePage.goto();
    await homePage.clickAboutUs();
    await expect(page).toHaveURL(/about-us/);
  });

  test('RG_003 - Accessing /account without login redirects to /account/login', async ({ page }) => {
    await page.goto('/account');
    await page.waitForURL(/account\/login/, { timeout: 10_000 });
    expect(page.url()).toContain('account/login');
  });

  test('RG_004 - Accessing /checkout without items redirects to /cart', async ({ page }) => {
    await page.goto('/checkout');
    await page.waitForURL(/cart|checkout/, { timeout: 10_000 });
    expect(page.url()).toContain('tvn-sut.info');
  });

  test('RG_005 - Register page "Login" link works', async ({ registerPage, page }) => {
    await registerPage.goto();
    await registerPage.clickLoginLink();
    await page.waitForURL(/account\/login/, { timeout: 10_000 });
    await expect(page).toHaveTitle('Login');
  });

  test('RG_006 - Login page "Create an account" link works', async ({ loginPage, page }) => {
    await loginPage.goto();
    await loginPage.clickCreateAccount();
    await page.waitForURL(/register/, { timeout: 10_000 });
    await expect(page).toHaveTitle('Create an account');
  });

  test('RG_007 - Mini cart icon visible on all main pages', async ({ page }) => {
    const pages = ['/', '/accessories', '/account/login', '/account/register', '/cart'];
    for (const path of pages) {
      await page.goto(path, { waitUntil: 'domcontentloaded' });
      const miniCart = page.locator('.mini-cart-icon');
      await expect(miniCart).toBeVisible({ timeout: 5_000 });
    }
  });

  test('RG_008 - Product detail for all Thermos variants load correctly', async ({ page }) => {
    const variants = [
      { slug: 'stainless-steel-thermos-yellow', expectedTitle: 'Stainless Steel Thermos - Yellow' },
      { slug: 'stainless-steel-thermos-black',  expectedTitle: 'Stainless Steel Thermos - Black' },
      { slug: 'stainless-steel-thermos-white',  expectedTitle: 'Stainless Steel Thermos - White' },
    ];

    for (const { slug, expectedTitle } of variants) {
      await page.goto(`/accessories/${slug}`, { waitUntil: 'domcontentloaded' });
      await expect(page).toHaveTitle(expectedTitle);
      await expect(page.locator('button:has-text("ADD TO CART")')).toBeVisible();
    }
  });

  test('RG_009 - Browser back button from product detail returns to product list', async ({ productListPage, productDetailPage, page }) => {
    await productListPage.goto();
    await productDetailPage.gotoProduct('stainless-steel-thermos-yellow');
    await page.goBack();
    await page.waitForURL(/accessories$/, { timeout: 10_000 });
    expect(page.url()).toMatch(/\/accessories$/);
  });

  test('RG_010 - Page title changes correctly when navigating between pages', async ({ page }) => {
    await page.goto('/');
    expect(await page.title()).toBe('EverShop');

    await page.goto('/accessories');
    expect(await page.title()).toBe('Fashion Accessories');

    await page.goto('/account/login');
    expect(await page.title()).toBe('Login');

    await page.goto('/account/register');
    expect(await page.title()).toBe('Create an account');

    await page.goto('/cart');
    expect(await page.title()).toBe('Shopping cart');
  });
});
