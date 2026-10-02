import { chromium } from 'playwright';
const b=await chromium.launch({headless:true}); const p=await b.newPage();
for(const suffix of ['', '?lens=source%3Aga4']) {
 await p.goto('http://127.0.0.1:5180/observatory-v2#/intelligence/client/canopy/current'+suffix);
 await p.locator('h1').first().waitFor();
 console.log(await p.getByRole('navigation',{name:'Breadcrumb',exact:true}).innerText());
 if(await p.getByText('Page not found',{exact:true}).count())throw Error('Route failed');
}
await b.close();
