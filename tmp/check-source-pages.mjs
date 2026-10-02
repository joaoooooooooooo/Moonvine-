import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
const browser = await chromium.launch({headless:true});
const page = await browser.newPage();
const errors=[];
page.on('pageerror', e=>errors.push(e.message));
await mkdir('output/source-pages',{recursive:true});
for(const width of [1920,390]) {
 await page.setViewportSize({width,height:945});
 for(const lens of ['ga4','gsc','social','news','semrush']) {
  await page.goto('http://127.0.0.1:5180/observatory-v2#/console/client/canopy/current?lens=source%3A'+lens);
  await page.locator('h1').first().waitFor();
  await page.evaluate(()=>document.fonts.ready);
  await page.screenshot({path:`output/source-pages/${lens}-${width}.png`});
  const result=await page.evaluate(()=>({title:document.querySelector('h1')?.textContent,brokenImages:[...document.images].filter(i=>i.complete&&!i.naturalWidth).map(i=>i.src),overflow:document.documentElement.scrollWidth>innerWidth}));
  console.log(JSON.stringify({lens,width,...result}));
 }
}
console.log(JSON.stringify({errors}));
await browser.close();
