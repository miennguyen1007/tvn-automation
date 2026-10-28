const { chromium } = require("@playwright/test");
const SCREENSHOTS_DIR = "C:/Users/Admin/.gemini/antigravity/brain/6f9ba2c1-b540-428c-91be-9c4265d44b8b";

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ ignoreHTTPSErrors: true, viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  // Add product to cart first
  await page.goto("https://tvn-sut.info/accessories/stainless-steel-thermos-yellow", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1500);
  await page.locator("button:has-text('ADD TO CART')").click();
  await page.waitForTimeout(2000);
  
  // Go to cart
  await page.goto("https://tvn-sut.info/cart", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1500);
  console.log("CART URL:", page.url());
  
  // Cart content
  const cartInputs = await page.$$eval("input, button, select, textarea", els =>
    els.map(e => ({ tag: e.tagName, type: e.type, name: e.name, id: e.id, className: e.className.substring(0,80), text: e.innerText?.trim().substring(0,50) }))
  );
  console.log("Cart Elements:", JSON.stringify(cartInputs, null, 2));
  
  const cartLinks = await page.$$eval("a[href]", els => els.map(e => e.innerText.trim().substring(0,40) + " => " + e.href));
  console.log("Cart Links:", cartLinks.join("\n  - "));
  
  await page.screenshot({ path: `${SCREENSHOTS_DIR}/cart-with-item.png`, fullPage: true });
  
  // Proceed to checkout
  const checkoutBtn = page.locator("a:has-text('CHECKOUT'), button:has-text('CHECKOUT'), a:has-text('Checkout'), button:has-text('Checkout')");
  if (await checkoutBtn.count() > 0) {
    await checkoutBtn.first().click();
    await page.waitForTimeout(2000);
    console.log("CHECKOUT URL:", page.url());
    
    const checkoutInputs = await page.$$eval("input, button, select, textarea", els =>
      els.map(e => ({ tag: e.tagName, type: e.type, name: e.name, id: e.id, placeholder: e.placeholder, className: e.className.substring(0,80), text: e.innerText?.trim().substring(0,50) }))
    );
    console.log("Checkout Elements:", JSON.stringify(checkoutInputs, null, 2));
    
    await page.screenshot({ path: `${SCREENSHOTS_DIR}/checkout-real.png`, fullPage: true });
  }

  await browser.close();
})();
