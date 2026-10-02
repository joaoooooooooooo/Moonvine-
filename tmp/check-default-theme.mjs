import { chromium } from 'playwright';
const browser = await chromium.launch({headless:true});
const page = await browser.newPage({colorScheme:'light'});
await page.goto('http://127.0.0.1:5180/observatory-v2#/console');
await page.waitForFunction(()=>document.documentElement.classList.contains('dark'));
console.log('Fresh visit defaults to dark with light OS preference');
await page.getByRole('button', {name:'Open workspace menu', exact:true}).click();
await page.getByRole('menuitem', {name:'Theme', exact:true}).hover();
await page.getByRole('menuitemradio', {name:'Light', exact:true}).click();
await page.waitForFunction(()=>!document.documentElement.classList.contains('dark'));
await page.reload();
await page.locator('h1').first().waitFor();
if(await page.evaluate(()=>document.documentElement.classList.contains('dark'))) throw Error('Light preference was not preserved');
console.log('Light option works and survives reload');
await browser.close();

