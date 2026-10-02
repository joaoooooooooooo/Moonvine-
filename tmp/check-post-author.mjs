import { chromium } from 'playwright';
const b=await chromium.launch({headless:true});const p=await b.newPage();
await p.goto('http://127.0.0.1:5180/observatory-v2#/intelligence/client/canopy/current?lens=source%3Asocial');
const card=p.locator('.v2-signals-grid [data-slot="frame-card"]').first();
await card.waitFor();
console.log(await card.locator('[data-slot="avatar"]').evaluate(e=>({width:e.getBoundingClientRect().width,height:e.getBoundingClientRect().height})));
await b.close();
