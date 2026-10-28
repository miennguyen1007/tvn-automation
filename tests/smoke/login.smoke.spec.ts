import { test, expect } from '../../src/fixtures';
import { LoginPage } from '../../src/pages/LoginPage';
import { config } from '../../src/data/config';

/**
 * SMOKE TESTS — EverShop tvn-sut.info
 * Selectors: VERIFIED on 2026-10-28 via live browser crawl
 * Run: npx playwright test tests/smoke --project=smoke:chromium
 */
test.describe('[SMOKE] EverShop Critical Path', () => {
  test('TC_SM_001 - Homepage loads with title EverShop', async ({ page, homePage }) => {
    await homePage.goto();
    await expect(page).toHaveTitle('EverShop');
    await homePage.assertVisible(homePage.heroHeading);
  });

  test('TC_SM_002 - Login page loads with correct heading', async ({ page, loginPage }) => {
    await loginPage.goto();
    await expect(page).toHaveTitle('Login');
    await loginPage.assertVisible(loginPage.emailInput);
    await loginPage.assertVisible(loginPage.passwordInput);
    await loginPage.assertVisible(loginPage.loginButton);
    await loginPage.assertContainsText(loginPage.pageHeading, 'Welcome Back');
  });

  test('TC_SM_003 - Register page loads with correct heading', async ({ page, registerPage }) => {
    await registerPage.goto();
    await expect(page).toHaveTitle('Create an account');
    await registerPage.assertVisible(registerPage.fullNameInput);
    await registerPage.assertVisible(registerPage.emailInput);
    await registerPage.assertVisible(registerPage.passwordInput);
    await registerPage.assertVisible(registerPage.signUpButton);
  });

  test('TC_SM_004 - Product list page loads with products', async ({ page, productListPage }) => {
    await productListPage.goto();
    await expect(page).toHaveTitle('Fashion Accessories');
    const count = await productListPage.getProductCount();
    expect(count).toBeGreaterThan(0);
  });

  test('TC_SM_005 - Product detail page loads correctly', async ({ page, productDetailPage }) => {
    await productDetailPage.gotoProduct('stainless-steel-thermos-yellow');
    await expect(page).toHaveTitle('Stainless Steel Thermos - Yellow');
    await productDetailPage.assertVisible(productDetailPage.qtyInput);
    await productDetailPage.assertVisible(productDetailPage.addToCartButton);
  });

  test('TC_SM_006 - Cart page accessible', async ({ page, cartPage }) => {
    await cartPage.goto();
    await expect(page).toHaveTitle('Shopping cart');
    await cartPage.assertVisible(cartPage.pageHeading);
  });

  test('TC_SM_007 - Navigation: Home → View Collection → Accessories', async ({ page, homePage }) => {
    await homePage.goto();
    await homePage.clickViewCollection();
    await expect(page).toHaveURL(/accessories/);
  });

  test('TC_SM_008 - Login page has Forgot password link', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.assertVisible(loginPage.forgotPasswordLink);
    const href = await loginPage.forgotPasswordLink.getAttribute('href');
    expect(href).toContain('reset-password');
  });
});
