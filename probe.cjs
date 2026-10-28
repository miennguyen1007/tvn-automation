const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    ignoreHTTPSErrors: true
  });
  const page = await context.newPage();

  try {
    console.log('Navigating to https://tvn-sut.info ...');
    const response = await page.goto('https://tvn-sut.info', { waitUntil: 'domcontentloaded', timeout: 30000 });
    console.log('Status:', response?.status());
    console.log('URL:', page.url());
    console.log('Title:', await page.title());

    // Headings
    const headings = await page.$$eval('h1,h2,h3', els => els.map(e => e.innerText.trim()));
    console.log('Headings:', JSON.stringify(headings));

    // All links
    const links = await page.$$eval('a[href]', els => els.map(e => ({ text: e.innerText.trim().substring(0,40), href: e.href })).slice(0, 25));
    console.log('Links:', JSON.stringify(links, null, 2));

    // Form elements
    const inputs = await page.$$eval('input, button, select, textarea', els =>
      els.map(e => ({ tag: e.tagName, type: e.type, name: e.name, id: e.id, class: e.className.substring(0,50), placeholder: e.placeholder, text: e.innerText?.trim().substring(0,30) }))
    );
    console.log('FormElements:', JSON.stringify(inputs, null, 2));

    // Nav items
    const navItems = await page.$$eval('nav a, .nav a, .menu a, .navbar a', els => els.map(e => ({ text: e.innerText.trim(), href: e.href })));
    console.log('NavItems:', JSON.stringify(navItems, null, 2));

    await page.screenshot({ path: 'C:/Users/Admin/.gemini/antigravity/brain/6f9ba2c1-b540-428c-91be-9c4265d44b8b/homepage.png', fullPage: true });
    console.log('Screenshot saved!');

  } catch(e) {
    console.error('Error:', e.message);
    try {
      await page.screenshot({ path: 'C:/Users/Admin/.gemini/antigravity/brain/6f9ba2c1-b540-428c-91be-9c4265d44b8b/error-state.png' });
    } catch(_) {}
  }

  await browser.close();
})();

