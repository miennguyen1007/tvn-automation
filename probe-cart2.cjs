const { chromium } = require("@playwright/test");
const SCREENSHOTS_DIR = "C:/Users/Admin/.gemini/antigravity/brain/6f9ba2c1-b540-428c-91be-9c4265d44b8b";

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ ignoreHTTPSErrors: true, viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  // Intercept network to see API calls
  const apiCalls = [];
  page.on('request', req => {
    if (req.url().includes('/api/') || req.url().includes('graphql') || req.method() === 'POST') {
      apiCalls.push({ method: req.method(), url: req.url() });
    }
  });

  // Add product to cart via API directly
  await page.goto("https://tvn-sut.info/accessories/stainless-steel-thermos-yellow", { waitUntil: "networkidle" });
  await page.waitForTimeout(2000);

  // Click variant button (Yellow already selected)
  const addToCartBtn = page.locator("button:has-text('ADD TO CART')");
  if (await addToCartBtn.count() > 0) {
    await addToCartBtn.click();
    console.log("Clicked ADD TO CART");
    await page.waitForTimeout(3000);
  }

  // Check mini cart
  const miniCart = page.locator(".mini-cart-icon");
  console.log("Mini cart count:", await miniCart.count());

  // Navigate to cart
  await page.goto("https://tvn-sut.info/cart", { waitUntil: "networkidle" });
  await page.waitForTimeout(2000);
  console.log("Cart URL:", page.url());

  const bodyText = await page.locator("body").innerText();
  console.log("Cart body (first 1000 chars):", bodyText.substring(0, 1000));

  // All elements on cart page
  const allElements = await page.$$eval("input, button, a[href], select", els =>
    els.map(e => ({ tag: e.tagName, text: e.innerText?.trim().substring(0, 50), href: e.href, name: e.name, id: e.id, type: e.type })).filter(e => e.text || e.name || e.id)
  );
  console.log("All interactive elements:", JSON.stringify(allElements, null, 2));

  console.log("API calls:", JSON.stringify(apiCalls, null, 2));
  await page.screenshot({ path: `${SCREENSHOTS_DIR}/cart-after-add.png`, fullPage: true });

  await browser.close();
})();

