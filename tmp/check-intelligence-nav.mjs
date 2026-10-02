import { chromium } from 'playwright';
const b=await chromium.launch({headless:true});
const p=await b.newPage({viewport:{width:1440,height:945}});
const errors=[]; p.on('pageerror',e=>errors.push(e.message));
await p.goto('http://127.0.0.1:5180/observatory-v2#/console/client/canopy/current');
const nav=p.getByRole('navigation',{name:'Main navigation'});
console.log(await nav.innerText());
for(const label of ['AI visibility','Investor intelligence','Google Analytics','Google Search Console','Social media','News + media','Site health','Search competitors','Reports','Connection status']) {
 await nav.getByRole('link',{name:label,exact:true}).click();
 await p.waitForFunction(()=>!document.body.innerText.includes('Page not found'));
 await nav.getByRole('link',{name:label,exact:true}).getAttribute('aria-current').then(v=>{if(v!=='page')throw Error(label)});
}
await nav.getByRole('link',{name:'Observatory',exact:true}).click();
await p.getByRole('navigation',{name:'Observatory directory'}).waitFor();
console.log({errors,backNavigation:'passed'});
await b.close();
