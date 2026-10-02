import { chromium } from 'playwright';
const b=await chromium.launch({headless:true});const p=await b.newPage();const errors=[];p.on('pageerror',e=>errors.push(e.message));
for(const width of [1920,390]){
 await p.setViewportSize({width,height:945});
 await p.goto('http://127.0.0.1:5180/observatory-v2#/intelligence/client/canopy/current?lens=source%3Asocial');
 await p.getByRole('heading',{name:'Watched handles',exact:true}).waitFor();
 await p.getByRole('button',{name:'Canopy Living',exact:true}).click();
 await p.getByText('No posts captured',{exact:true}).waitFor();
 await p.getByRole('button',{name:'Watched',exact:true}).click();
 await p.getByRole('heading',{name:'The Creative Table',exact:true}).waitFor();
 await p.screenshot({path:`output/social-content-${width}.png`});
 console.log({width,overflow:await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),images:await p.locator('img').evaluateAll(es=>es.filter(i=>i.complete&&!i.naturalWidth).map(i=>i.src))});
}
console.log({errors});await b.close();
