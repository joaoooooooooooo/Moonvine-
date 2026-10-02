const { chromium } = require('playwright');
const assert = require('node:assert/strict');
(async () => {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    page.setDefaultTimeout(10000);
    await page.addInitScript(() => {
      window.drawnTexts = [];
      const fill = CanvasRenderingContext2D.prototype.fillText;
      CanvasRenderingContext2D.prototype.fillText = function (text, ...args) {
        if (this.canvas.getAttribute('role') === 'img') window.drawnTexts.push(text);
        return fill.call(this, text, ...args);
      };
    });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto('http://localhost:5173/#/brand-tools/citation');
    await page.getByRole('button', { name: 'Pause', exact: true }).click();
    const quote = page.getByRole('textbox', { name: 'Citation', exact: true });
    await quote.fill('Hello.');
    const drawn = async () => {
      await page.evaluate(() => window.drawnTexts = []);
      await page.waitForTimeout(100);
      return page.evaluate(() => [...new Set(window.drawnTexts)]);
    };
    let texts = await drawn();
    assert.ok(texts.includes('Hello.'));
    assert.ok(texts.includes('Tom Conlon'));
    assert.ok(!texts.some(text => text.includes('â€œ') || text.includes('â€')));
    await page.getByRole('switch', { name: 'Show author details' }).click();
    assert.deepEqual(await drawn(), ['Hello.']);
    assert.equal(await page.getByRole('textbox', { name: 'Author', exact: true }).count(), 0);
    assert.ok(!(await page.locator('canvas[role=img]').getAttribute('aria-label')).includes('Tom Conlon'));
    const authorArea = await page.locator('canvas[role=img]').evaluate(canvas => {
      const data = canvas.getContext('2d').getImageData(98, 511, 400, 100).data;
      let marks = 0;
      for (let i = 0; i < data.length; i += 4) if (data[i] !== 27) marks++;
      return marks;
    });
    assert.equal(authorArea, 0);
    await page.reload();
    assert.equal(await page.getByRole('switch', { name: 'Show author details' }).isChecked(), false);
    await page.getByRole('switch', { name: 'Show author details' }).click();
    assert.equal(await page.getByRole('textbox', { name: 'Author', exact: true }).inputValue(), 'Tom Conlon');
    await quote.fill('â€œHello.â€');
    texts = await drawn();
    assert.ok(texts.includes('â€œHello.â€'));
    assert.deepEqual(errors, []);
    console.log('PASS: exact punctuation, author/attribution/rule hidden, saved toggle, names retained, accessible preview, no errors');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exit(1); });


