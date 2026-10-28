const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  const page = await context.newPage();
  
  try {
    console.log('Navigating to https://tvn-sut.info ...');
    await page.goto('https://tvn-sut.info', { waitUntil: 'domcontentloaded', timeout: 30000 });
    console.log('URL:', page.url());
    console.log('Title:', await page.title());
    
    // Get all links
    const links = await page.$$eval('a[href]', els => els.map(e => ({ text: e.innerText.trim(), href: e.href })).slice(0, 20));
    console.log('Links:', JSON.stringify(links, null, 2));
    
    // Get all inputs
    const inputs = await page.$$eval('input, button, select, textarea', els => 
      els.map(e => ({ tag: e.tagName, type: e.type, name: e.name, id: e.id, placeholder: e.placeholder, text: e.innerText?.trim() }))
    );
    console.log('Form Elements:', JSON.stringify(inputs, null, 2));

    // Get page heading
    const headings = await page.$$eval('h1,h2,h3', els => els.map(e => e.innerText.trim()));
    console.log('Headings:', JSON.stringify(headings));

    await page.screenshot({ path: 'C:/Users/Admin/.gemini/antigravity/brain/6f9ba2c1-b540-428c-91be-9c4265d44b8b/homepage.png', fullPage: true });
    console.log('Screenshot saved!');
    
  } catch(e) {
    console.error('Error:', e.message);
    // Try to get current state
    console.log('Current URL:', page.url());
    console.log('Current Title:', await page.title().catch(() => 'N/A'));
  }
  
  await browser.close();
})();
