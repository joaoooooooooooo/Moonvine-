import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true, ...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE } : {}) });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const errors = [];
page.on('pageerror', (error) => errors.push(error.message));
const origin = process.env.PREVIEW_URL || 'http://127.0.0.1:5180';
const output = 'output/observatory-live';
await mkdir(output, { recursive: true });
async function visible(locator) { await locator.waitFor({ state: 'visible' }); }
async function selectTheme(name) {
  await page.getByRole('button', { name: 'Select theme', exact: true }).click();
  await page.getByRole('menuitem', { name, exact: true }).click();
}

try {
  await page.goto(origin + '/observatory-v2#/console');
  await visible(page.getByRole('heading', { name: '3 accounts. 25 people.', exact: true }));
  await visible(page.getByRole('navigation', { name: 'Main navigation' }));
  assert.equal(await page.getByRole('button', { name: 'Open navigation', exact: true }).isVisible(), false);
  await page.keyboard.press('Control+b');
  await visible(page.getByRole('navigation', { name: 'Main navigation' }));
  await page.getByRole('button', { name: 'Search commands' }).click();
  await visible(page.getByRole('dialog', { name: 'Search Observatory' }));
  await page.screenshot({ path: output + '/command.png' });
  await page.getByRole('combobox', { name: 'Search pages, accounts, and commands' }).fill('Canopy');
  await page.keyboard.press('Enter');
  await visible(page.getByRole('heading', { name: 'Thoughtful products for everyday living.', exact: true }));
  await page.keyboard.press('Control+k');
  await visible(page.getByRole('dialog', { name: 'Search Observatory' }));
  await page.keyboard.press('Escape');
  await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Observatory', exact: true }).click();
  assert.equal(await page.getByText('Data scenario', { exact: true }).count(), 0);
  assert.equal(await page.getByRole('tab').count(), 0);
  await page.evaluate(() => document.fonts.ready);
  const headingStyle = await page.getByRole('heading', { name: '3 accounts. 25 people.', exact: true }).evaluate((element) => ({ family: getComputedStyle(element).fontFamily, weight: getComputedStyle(element).fontWeight }));
  assert.match(headingStyle.family, /Geist/);
  assert.equal(headingStyle.weight, '400');
  await selectTheme('Dark');
  assert.equal(await page.evaluate(() => document.documentElement.classList.contains('dark')), true);
  await page.reload();
  await visible(page.getByRole('heading', { name: '3 accounts. 25 people.', exact: true }));
  assert.equal(await page.evaluate(() => document.documentElement.classList.contains('dark')), true);
  await selectTheme('Light');
  assert.equal(await page.getByRole('navigation', { name: 'Observatory directory' }).getByRole('link').count(), 4);
  const bounds = await page.getByRole('navigation', { name: 'Observatory directory' }).getByRole('link').evaluateAll((links) => links.map((link) => { const rect = link.getBoundingClientRect(); return { y: rect.y, x: rect.x, width: rect.width }; }));
  assert.ok(bounds.every((rect, i) => !i || rect.y > bounds[i - 1].y), 'Directory rows must be stacked');
  await page.screenshot({ path: output + '/home.png' });
  await page.getByRole('link', { name: /Accounts Customers/ }).click();
  await visible(page.getByRole('heading', { name: 'Customers and prospects you watch here. 3 accounts.', exact: true }));
  assert.equal(await page.locator('header nav[aria-label="Breadcrumb"]').count(), 1);
  assert.equal(await page.locator('[data-v2-page-content] nav[aria-label="Breadcrumb"]').count(), 0);
  assert.equal(await page.getByRole('searchbox', { name: 'Search accounts' }).count(), 0);
  await page.getByRole('link', { name: 'Northstar Studio', exact: true }).click();
  await visible(page.getByRole('heading', { name: 'Signals', exact: true }));
  assert.equal(await page.getByRole('tab').count(), 0);
  assert.equal(await page.getByRole('dialog').count(), 0);
  await page.screenshot({ path: output + '/account.png' });
  await page.getByRole('link', { name: /^AI visibility/ }).click();
  await visible(page.locator('[data-v2-page-content] h1'));
  assert.ok(page.url().includes('lens=insight%3Aai-visibility'));
  assert.equal(await page.getByRole('dialog').count(), 0, 'Source is a page, not a dialog');
  await page.screenshot({ path: output + '/source.png' });
  await page.goBack();
  await visible(page.getByRole('heading', { name: 'Signals', exact: true }));
  await page.getByRole('link', { name: /^Google Analytics/ }).click();
  await page.getByRole('combobox', { name: 'Report week', exact: true }).click();
  await page.getByRole('option', { name: /^Sep 14/ }).click();
  assert.ok(page.url().includes('period=previous'));
  await page.goto(origin + '/observatory-v2#/console/client/northstar/current');
  await page.getByRole('link', { name: 'Edit account profile for Northstar Studio', exact: true }).click();
  await page.getByRole('textbox', { name: 'Organization name' }).fill('Northstar Design');
  await page.getByRole('button', { name: 'Save changes', exact: true }).click();
  await visible(page.getByRole('navigation', { name: 'Breadcrumb' }).getByText('Northstar Design', {exact:true}));
  await page.getByRole('link', { name: /^Report history/ }).click();
  await visible(page.getByRole('table', { name: 'Reports', exact: true }));
  await page.getByRole('button', { name: 'Open workspace menu', exact: true }).click();
  await visible(page.getByRole('menuitem', { name: 'Account settings', exact: true }));
  await page.keyboard.press('Escape');
  await page.getByRole('navigation', { name: 'Breadcrumb' }).getByRole('link', { name: 'Observatory', exact: true }).click();
  await selectTheme('Dark');
  await page.screenshot({ path: output + '/home-dark.png' });
  for (const width of [390, 768, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    await page.screenshot({ path: output + '/home-' + width + '.png' });
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole('button', { name: 'Open navigation', exact: true }).click();
  await visible(page.getByRole('dialog', { name: 'Sidebar', exact: true }));
  await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Accounts', exact: true }).click();
  await visible(page.getByRole('heading', { name: 'Customers and prospects you watch here. 3 accounts.', exact: true }));
  await page.getByRole('dialog', { name: 'Sidebar', exact: true }).waitFor({ state: 'hidden' });
  for (const [name, route] of [
    ['account', '/console/client/northstar/current'],
    ['analytics', '/console/client/northstar/current?lens=source%3Aga4'],
    ['ai', '/console/client/northstar/current?lens=insight%3Aai-visibility'],
  ]) {
    await page.goto(origin + '/observatory-v2#' + route);
    await visible(name === 'account' ? page.getByRole('heading', { name: 'Signals', exact: true }) : page.getByRole('navigation', { name: 'Breadcrumb' }));
    for (const width of [390, 1440]) {
      await page.setViewportSize({ width, height: 1000 });
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, name + ' must fit viewport');
      await page.screenshot({ path: output + '/' + name + '-' + width + '.png', fullPage: true });
    }
  }
  await page.goto(origin + '/#/observatory');
  await visible(page.getByRole('heading', { name: 'Ai visibility', exact: true }));
  assert.equal(await page.getByRole('link', { name: 'Observatory V2', exact: true }).count(), 0, 'No recreation link in prototype sidebar');
  await page.goto(origin + '/#/observatory-v2');
  await page.waitForURL('**/observatory-v2#/console');
  await visible(page.getByRole('heading', { name: '3 accounts. 25 people.', exact: true }));
  assert.equal(new URL(page.url()).pathname, '/observatory-v2');
  assert.deepEqual(errors, []);
  console.log('PASS: isolated V2 shell, sidebar navigation, command search and keyboard shortcut, mobile drawer, account/source routes, Back, week selection, profile save, reports, theme persistence, responsive widths, V1 unchanged, legacy URL redirect, no runtime errors.');
} catch (error) {
  await page.screenshot({ path: output + '/failure.png' });
  console.error((await page.locator('body').innerText()).slice(0, 4000));
  throw error;
} finally {
  await browser.close();
}
