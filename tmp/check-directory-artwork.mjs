import { chromium } from 'playwright';
const b=await chromium.launch({headless:true});
const p=await b.newPage({viewport:{width:1920,height:945}});
await p.goto('http://127.0.0.1:5180/observatory-v2#/console');
await p.locator('nav[aria-label="Observatory directory"] img').first().waitFor();
await p.screenshot({path:'output/directory-artwork.png'});
console.log(await p.locator('nav[aria-label="Observatory directory"] a').evaluateAll(es=>es.map(e=>({width:e.getBoundingClientRect().width,height:e.getBoundingClientRect().height}))));
await b.close();
