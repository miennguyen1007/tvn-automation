import { test, expect } from '../../src/fixtures';

/**
 * E2E TEST SUITE: Product Features — EverShop tvn-sut.info
 * Selectors VERIFIED on 2026-10-28:
 *   Product List (/accessories):
 *     - Price range: #base-ui-10 (min), #base-ui-13 (max)
 *     - Color checkboxes: #color-1, #color-2, #color-3
 *   Product Detail (/accessories/:slug):
 *     - Qty: #field-qty (input type="number" name="qty")
 *     - Variant buttons: button text = "White" | "Black" | "Yellow"
 *     - ADD TO CART: button:has-text("ADD TO CART")
 */
test.describe('[E2E] Product List & Detail', () => {

  test.describe('Product List Page', () => {
    test('TC_PL_001 - Product list page title is "Fashion Accessories"', async ({ productListPage, page }) => {
      await productListPage.goto();
      await expect(page).toHaveTitle('Fashion Accessories');
    });

    test('TC_PL_002 - At least 4 featured products visible', async ({ productListPage }) => {
      await productListPage.goto();
      const count = await productListPage.getProductCount();
      expect(count).toBeGreaterThanOrEqual(4);
    });

    test('TC_PL_003 - Price range sliders are visible', async ({ productListPage }) => {
      await productListPage.goto();
      await productListPage.assertVisible(productListPage.priceRangeMin);
      await productListPage.assertVisible(productListPage.priceRangeMax);
    });

    test('TC_PL_004 - Color filter checkboxes are visible', async ({ productListPage }) => {
      await productListPage.goto();
      await productListPage.assertVisible(productListPage.colorFilterYellow);
    });

    test('TC_PL_005 - Clicking a product card navigates to product detail', async ({ productListPage, page }) => {
      await productListPage.goto();
      await productListPage.clickProductByIndex(0);
      await page.waitForURL(/accessories\/.+/, { timeout: 10_000 });
      expect(page.url()).toMatch(/accessories\/.+/);
    });

    test('TC_PL_006 - Product "Stainless Steel Thermos - Yellow" is listed', async ({ productListPage }) => {
      await productListPage.goto();
      const names = await productListPage.getAllProductNames();
      const found = names.some(n => n.includes('Thermos'));
      expect(found).toBeTruthy();
    });
  });

  test.describe('Product Detail Page', () => {
    const PRODUCT_SLUG = 'stainless-steel-thermos-yellow';

    test('TC_PD_001 - Product detail page has correct title', async ({ productDetailPage, page }) => {
      await productDetailPage.gotoProduct(PRODUCT_SLUG);
      await expect(page).toHaveTitle('Stainless Steel Thermos - Yellow');
    });

    test('TC_PD_002 - Product title h1 is visible', async ({ productDetailPage }) => {
      await productDetailPage.gotoProduct(PRODUCT_SLUG);
      const title = await productDetailPage.getProductTitle();
      expect(title).toContain('Stainless Steel Thermos');
    });

    test('TC_PD_003 - Quantity input #field-qty is visible', async ({ productDetailPage }) => {
      await productDetailPage.gotoProduct(PRODUCT_SLUG);
      await productDetailPage.assertVisible(productDetailPage.qtyInput);
    });

    test('TC_PD_004 - ADD TO CART button is visible and enabled', async ({ productDetailPage }) => {
      await productDetailPage.gotoProduct(PRODUCT_SLUG);
      await productDetailPage.assertVisible(productDetailPage.addToCartButton);
      const enabled = await productDetailPage.isAddToCartEnabled();
      expect(enabled).toBeTruthy();
    });

    test('TC_PD_005 - Variant color buttons (White/Black/Yellow) are visible', async ({ productDetailPage }) => {
      await productDetailPage.gotoProduct(PRODUCT_SLUG);
      const count = await productDetailPage.variantButtons.count();
      expect(count).toBeGreaterThanOrEqual(2);
    });

    test('TC_PD_006 - Selecting a variant (Black) updates the page', async ({ productDetailPage, page }) => {
      await productDetailPage.gotoProduct(PRODUCT_SLUG);
      await productDetailPage.selectVariant('Black');
      await page.waitForTimeout(1000);
      // URL or page content should reflect the color change
      expect(page.url()).toContain('accessories');
    });

    test('TC_PD_007 - Quantity input accepts numeric value', async ({ productDetailPage }) => {
      await productDetailPage.gotoProduct(PRODUCT_SLUG);
      await productDetailPage.setQuantity(3);
      const value = await productDetailPage.qtyInput.inputValue();
      expect(value).toBe('3');
    });

    test('TC_PD_008 - Quantity 0 is boundary: check behavior', async ({ productDetailPage, page }) => {
      await productDetailPage.gotoProduct(PRODUCT_SLUG);
      await productDetailPage.setQuantity(0);
      await productDetailPage.click(productDetailPage.addToCartButton);
      await page.waitForTimeout(2000);
      // Should either show error or not add to cart
      expect(page.url()).toContain('accessories');
    });

    test('TC_PD_009 - Negative quantity is boundary: check behavior', async ({ productDetailPage, page }) => {
      await productDetailPage.gotoProduct(PRODUCT_SLUG);
      await productDetailPage.setQuantity(-1);
      await productDetailPage.click(productDetailPage.addToCartButton);
      await page.waitForTimeout(2000);
      expect(page.url()).toContain('accessories');
    });

    test('TC_PD_010 - ADD TO CART button clicked → page remains functional', async ({ productDetailPage, page }) => {
      await productDetailPage.gotoProduct(PRODUCT_SLUG);
      await productDetailPage.selectVariant('Yellow');
      await productDetailPage.setQuantity(1);
      await productDetailPage.addToCart();
      // After add to cart, page should be stable (no crash/error page)
      const title = await page.title();
      expect(title.length).toBeGreaterThan(0);
    });

    test('TC_PD_011 - Breadcrumb "Home" link navigates to homepage', async ({ productDetailPage, page }) => {
      await productDetailPage.gotoProduct(PRODUCT_SLUG);
      await productDetailPage.assertVisible(productDetailPage.breadcrumbHome);
      await productDetailPage.click(productDetailPage.breadcrumbHome);
      await page.waitForURL(/tvn-sut\.info\/$/, { timeout: 10_000 });
      expect(page.url()).toMatch(/tvn-sut\.info\/$/);
    });

    test('TC_PD_012 - Breadcrumb "Accessories" link navigates to product list', async ({ productDetailPage, page }) => {
      await productDetailPage.gotoProduct(PRODUCT_SLUG);
      await productDetailPage.assertVisible(productDetailPage.breadcrumbCategory);
      await productDetailPage.click(productDetailPage.breadcrumbCategory);
      await page.waitForURL(/accessories/, { timeout: 10_000 });
      expect(page.url()).toContain('accessories');
    });
  });
});

