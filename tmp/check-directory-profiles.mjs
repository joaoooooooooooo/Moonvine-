import { chromium } from 'playwright';
const b=await chromium.launch({headless:true});const p=await b.newPage();
for(const route of ['accounts','people','entities']) {
 await p.goto('http://127.0.0.1:5180/observatory-v2#/console/'+route);
 await p.locator('tbody img').first().waitFor();
 await p.waitForFunction(()=>[...document.querySelectorAll('tbody img')].every(i=>i.complete&&i.naturalWidth>0));
 console.log(route+': profile images loaded');
}
await b.close();
