const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch({headless:true});const p=await b.newPage({viewport:{width:1440,height:1018},deviceScaleFactor:2,reducedMotion:'reduce'});await p.goto('http://127.0.0.1:5173/#/report-sections');await p.evaluate(()=>document.documentElement.classList.add('dark'));const desktopWidths=await p.evaluate(()=>({table:document.querySelector('table').getBoundingClientRect().width,sources:document.querySelector('#report-sources .grid').getBoundingClientRect().width,sourceCard:document.querySelector('#report-sources [data-slot="frame-card"]').getBoundingClientRect().width}));await p.emulateMedia({media:'print'});await p.evaluate(()=>{
for(const h of document.querySelectorAll('h2')) if(['Social activity worth watching','News and articles','Citation rankings','Weekly interactions stayed close to the recent baseline.','Questions asked','Website audit'].includes(h.textContent)) h.closest('section').setAttribute('data-pdf-break','');
for(const grid of document.querySelectorAll('.grid')) {
 if(!grid.querySelector('img[src*="report-media/apta"]')) continue;
 const cards=Array.from(grid.children); grid.style.display='flex';grid.style.flexDirection='column';grid.style.gap='24px';
 for(let i=0;i<cards.length;i+=3) {const row=document.createElement('div');row.className='pdf-social-row';for(const card of cards.slice(i,i+3))row.appendChild(card);grid.appendChild(row);}
}
for(const h of document.querySelectorAll('h3')) if(['Source Presence','Visibility','Share of Voice'].includes(h.textContent)) h.closest('[data-slot="frame-card"]').setAttribute('data-pdf-chart','');
document.querySelector('[data-pdf-chart]')?.closest('section').setAttribute('data-pdf-break','');
});await p.addStyleTag({content:`
#report-sources { break-before:page; padding-top:32px; }
.report-document [class*="min-h-[27rem]"] { min-height:280px!important; }
.report-document > section > .max-w-7xl { padding-top:32px!important; padding-bottom:32px!important; }
.report-document [data-slot="frame-card"]:has(table):not(:has(td.whitespace-normal)) { break-inside:avoid; }
#report-market-overview table td { padding-top:10px; padding-bottom:10px; }
[data-pdf-chart] { break-before:page; }
.pdf-social-row { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:12px; break-inside:avoid; }

.pdf-social-row [data-slot="frame-card"] { max-width:none!important; }

[data-pdf-break]:has(h4) { break-inside:avoid; padding-top:24px!important; padding-bottom:0!important; }
#report-next-steps section { padding-bottom:0!important; }
#report-next-steps [class*="pb-"] { padding-bottom:0!important; }
#report-next-steps [class*="min-h-[27rem]"] { min-height:240px!important; }
@page { size:1440px 1018px; margin:0; }
html,body { margin:0!important; padding:0!important; background:#111!important; print-color-adjust:exact; -webkit-print-color-adjust:exact; }
body::before { content:""; position:fixed; inset:0; z-index:-1; background:#111; }
.report-document { padding-top:0!important; }
.report-document > section { break-before:page; margin-inline:auto!important; } .report-document > section > .max-w-7xl { margin-inline:auto!important; }
.report-document > section:first-of-type { break-before:auto; }

.report-document > section > .pointer-events-none { display:none; }
.report-document > [aria-hidden="true"] { display:none; }
.report-document [data-slot="report-section-divider"] { display:none; }
[data-pdf-break] { break-before:page; padding-top:48px; }
.report-document [data-slot="frame-card"] { break-inside:avoid; }
.report-document [data-slot="frame-card"]:has(table) { display:block; }
.report-document [data-slot="frame-card"]:has(table) [data-slot="frame-card-content"] { display:block; }
.report-document ol { break-inside:avoid; }

`});await p.evaluate(()=>document.fonts.ready);await p.waitForFunction(()=>[...document.querySelectorAll('img')].every(i=>i.complete));await p.waitForTimeout(2000);console.log(await p.evaluate(()=>({desktop:matchMedia('(min-width:1280px)').matches,background:getComputedStyle(document.body).backgroundColor,brokenImages:[...document.querySelectorAll('img')].filter(i=>!i.naturalWidth).length,questions:document.querySelector('table:has(td.whitespace-normal) tbody')?.rows.length})));const pdfWidths=await p.evaluate(()=>({table:document.querySelector('table').getBoundingClientRect().width,sources:document.querySelector('#report-sources .grid').getBoundingClientRect().width,sourceCard:document.querySelector('#report-sources [data-slot="frame-card"]').getBoundingClientRect().width}));console.log({desktopWidths,pdfWidths});if(JSON.stringify(desktopWidths)!==JSON.stringify(pdfWidths))throw Error('Desktop and PDF widths differ');await p.pdf({path:'output/pdf/apta-agency-example-report-section-centered.pdf',width:'1440px',height:'1018px',printBackground:true,preferCSSPageSize:true,displayHeaderFooter:false,margin:{top:0,right:0,bottom:0,left:0}});await b.close();})();

