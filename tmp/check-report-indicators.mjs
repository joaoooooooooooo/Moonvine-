import { chromium } from 'playwright';
const b=await chromium.launch({headless:true});const p=await b.newPage();
const errors=[];p.on('pageerror',e=>errors.push(e.message));
await p.goto('http://127.0.0.1:5180/observatory-v2#/intelligence/client/canopy/current?lens=report%3Ahistory');
await p.locator('tbody').waitFor();
console.log('Unread rows initially',await p.locator('tbody').getByText('Unread report',{exact:true}).count());
for(let i=0;i<2;i++){
 await p.locator('tbody tr').nth(i).getByRole('button',{name:/Open Weekly/}).click();
 await p.getByRole('dialog').waitFor();
 await p.getByRole('button',{name:'Close',exact:true}).last().click();
}
console.log('Unread rows after opening',await p.locator('tbody').getByText('Unread report',{exact:true}).count());
if(await p.getByRole('navigation',{name:'Main navigation'}).getByText('Unread report',{exact:true}).count())throw Error('Sidebar indicator remained');
await p.getByRole('link',{name:'Overview',exact:true}).click();
await p.getByRole('button',{name:/Report week:/}).click();
await p.getByRole('button',{name:'Last week',exact:true}).click();
await p.waitForURL(/period=previous/);
await p.getByRole('button',{name:/Report week:/}).click();
await p.getByRole('button',{name:'This week',exact:true}).click();
await p.waitForURL(url=>!url.searchParams.has('period')&&!url.hash.includes('period='));
console.log({shortcuts:'passed',errors});await b.close();
