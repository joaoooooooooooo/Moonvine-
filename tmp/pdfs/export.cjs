const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch({headless:true});const p=await b.newPage({viewport:{width:1440,height:2036},deviceScaleFactor:2,reducedMotion:'reduce'});await p.goto('http://127.0.0.1:5173/#/report-sections');await p.evaluate(()=>document.documentElement.classList.add('dark'));await p.emulateMedia({media:'print'});await p.evaluate(()=>{
for(const el of document.querySelectorAll('[class]')) if(el.classList.contains('xl:px-[10.5rem]')) {el.style.setProperty('padding-left','0','important');el.style.setProperty('padding-right','0','important');}
for(const h of document.querySelectorAll('h2')) if(['Social activity worth watching','News and articles','Questions asked','Website audit'].includes(h.textContent)) h.closest('section').setAttribute('data-pdf-break','');
for(const h of document.querySelectorAll('h3')) if(['Source Presence','Visibility','Share of Voice'].includes(h.textContent)) h.closest('[data-slot="frame-card"]').setAttribute('data-pdf-chart','');
document.querySelector('[data-pdf-chart]')?.closest('section').setAttribute('data-pdf-break','');
});await p.addStyleTag({content:`
@page { size:1440px 2036px; margin:0; }
html,body { margin:0!important; padding:0!important; background:#111!important; print-color-adjust:exact; -webkit-print-color-adjust:exact; }
body::before { content:""; position:fixed; inset:0; z-index:-1; background:#111; }
.report-document { padding-top:0!important; }
.report-document > section { break-before:page; }
.report-document > section:first-of-type { break-before:auto; }
.report-document > section > .max-w-7xl { max-width:none!important; padding-left:48px!important; padding-right:48px!important; padding-top:48px!important; padding-bottom:48px!important; }
.report-document > section > .pointer-events-none { display:none; }
.report-document > [aria-hidden="true"] { display:none; }
.report-document [data-slot="report-section-divider"] { display:none; }
[data-pdf-break] { break-before:page; padding-top:48px; }
.report-document [data-slot="frame-card"] { break-inside:avoid; }
.report-document [data-slot="frame-card"]:has(table) { display:block; }
.report-document [data-slot="frame-card"]:has(table) [data-slot="frame-card-content"] { display:block; }
.report-document ol { break-inside:avoid; }
.report-document footer .max-w-7xl { max-width:none; padding-left:48px; padding-right:48px; }
`});await p.evaluate(()=>document.fonts.ready);await p.waitForFunction(()=>[...document.querySelectorAll('img')].every(i=>i.complete));await p.waitForTimeout(2000);console.log(await p.evaluate(()=>({desktop:matchMedia('(min-width:1280px)').matches,background:getComputedStyle(document.body).backgroundColor,brokenImages:[...document.querySelectorAll('img')].filter(i=>!i.naturalWidth).length,questions:document.querySelector('table:has(td.whitespace-normal) tbody')?.rows.length})));await p.pdf({path:'output/pdf/apta-agency-example-report-desktop.pdf',width:'1440px',height:'2036px',printBackground:true,preferCSSPageSize:true,displayHeaderFooter:false,margin:{top:0,right:0,bottom:0,left:0}});await b.close();})();
