import { chromium } from 'playwright';
const b=await chromium.launch({headless:true});const p=await b.newPage({viewport:{width:1440,height:945}});
await p.goto('http://127.0.0.1:5180/observatory-v2#/console/reports');
await p.getByRole('columnheader',{name:'Sent to'}).waitFor();
await p.waitForFunction(()=>document.querySelectorAll('tbody img').length>20&&[...document.querySelectorAll('tbody img')].every(i=>i.complete&&i.naturalWidth>0));
console.log('Sent to column and all account/recipient images loaded');
await b.close();
