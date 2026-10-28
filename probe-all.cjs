const { chromium } = require('@playwright/test');

const SCREENSHOTS_DIR = 'C:/Users/Admin/.gemini/antigravity/brain/6f9ba2c1-b540-428c-91be-9c4265d44b8b';

async function inspectPage(page, url, name) {
  try {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`PAGE: ${name} => ${url}`);
    console.log('='.repeat(60));

    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(1500);

    console.log('Final URL:', page.url());
    console.log('Title:', await page.title());

    // All inputs
    const inputs = await page.$$eval('input, textarea, select', els =>
      els.map(e => ({
        tag: e.tagName, type: e.type, name: e.name, id: e.id,
        placeholder: e.placeholder, className: e.className.substring(0, 80),
        required: e.required, ariaLabel: e.getAttribute('aria-label')
      }))
    );
    if (inputs.length) console.log('Inputs:', JSON.stringify(inputs, null, 2));

    // All buttons
    const buttons = await page.$$eval('button, input[type=submit], input[type=button]', els =>
      els.map(e => ({ tag: e.tagName, type: e.type, text: e.innerText?.trim().substring(0,50), id: e.id, className: e.className.substring(0,80) }))
    );
    if (buttons.length) console.log('Buttons:', JSON.stringify(buttons, null, 2));

    // Headings & labels
    const headings = await page.$$eval('h1,h2,h3,label', els => els.map(e => e.innerText.trim()).filter(t => t));
    if (headings.length) console.log('Headings/Labels:', JSON.stringify(headings));

    // Links
    const links = await page.$$eval('a[href]', els =>
      [...new Set(els.map(e => `${e.innerText.trim().substring(0,30)} => ${e.href}`))].slice(0, 30)
    );
    if (links.length) console.log('Links:', links.join('\n  - '));

    await page.screenshot({ path: `${SCREENSHOTS_DIR}/${name}.png`, fullPage: true });
    console.log(`Screenshot saved: ${name}.png`);

  } catch(e) {
    console.error(`Error on ${name}:`, e.message);
  }
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
    ignoreHTTPSErrors: true,
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();

  const pages = [
    ['https://tvn-sut.info/account/login', 'login'],
    ['https://tvn-sut.info/account/register', 'register'],
    ['https://tvn-sut.info/accessories', 'product-list'],
    ['https://tvn-sut.info/accessories/stainless-steel-thermos-yellow', 'product-detail'],
    ['https://tvn-sut.info/checkout', 'checkout'],
    ['https://tvn-sut.info/account', 'account'],
  ];

  for (const [url, name] of pages) {
    await inspectPage(page, url, name);
  }

  await browser.close();
  console.log('\nDone! All pages inspected.');
})();

