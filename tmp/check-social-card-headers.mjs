import { chromium } from 'playwright';
const b=await chromium.launch({headless:true});const p=await b.newPage({viewport:{width:1920,height:945}});
await p.goto('http://127.0.0.1:5180/observatory-v2#/intelligence/client/canopy/current?lens=source%3Asocial');
await p.getByRole('heading',{name:'3 posts captured this week'}).waitFor();
console.log(await p.locator('.v2-signals-grid > [data-slot="frame-card"]').evaluateAll(cards=>cards.map(c=>({header:c.querySelector('.v2-card-tagline').getBoundingClientRect().y,image:c.querySelector('img[loading]').getBoundingClientRect().y,border:getComputedStyle(c).borderWidth,shadow:getComputedStyle(c).boxShadow}))));
await p.screenshot({path:'output/social-card-headers.png'});await b.close();
