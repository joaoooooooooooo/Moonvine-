const fs=require('fs');
let s=fs.readFileSync('tmp/pdfs/export-section-centered.cjs','utf8');
const setup=`
for(const id of ['report-market-overview','report-ai-visibility','report-website-audit','report-next-steps']) {
 const section=document.getElementById(id), heading=section.querySelector('h1');
 if(!heading)throw Error('Missing heading '+id);
 const block=heading.closest('div.font-sans'),intro=block.closest('[class*="min-h-[27rem]"]');
 const divider=document.createElement('section');divider.className='pdf-section-title';divider.appendChild(block);section.before(divider);intro.remove();
}
`;
s=s.replace('});await p.addStyleTag({content:`',setup+'});await p.addStyleTag({content:`');
s=s.replace('@page {',`.pdf-section-title { height:1017px!important; display:flex!important; align-items:center!important; justify-content:center!important; break-after:page; padding:0!important; }
.pdf-section-title .font-sans { max-width:896px!important; width:896px; align-items:center!important; text-align:center!important; gap:32px!important; }
.pdf-section-title .font-sans > div { align-items:center!important; }
.pdf-section-title h1 { font-size:72px!important; line-height:1.08!important; text-align:center!important; }
.pdf-section-title p { max-width:680px!important; font-size:22px!important; line-height:1.5!important; text-align:center!important; }
.pdf-section-title [data-slot="badge"] { font-size:18px!important; }
@page {`);
s=s.replace('output/pdf/apta-agency-example-report-section-centered.pdf','tmp/pdfs/report-divider-base.pdf');
fs.writeFileSync('tmp/pdfs/export-dividers.cjs',s);
let center=fs.readFileSync('tmp/pdfs/center-pages.cjs','utf8').replace('output/pdf/apta-agency-example-report-section-centered.pdf','tmp/pdfs/report-divider-base.pdf').replace('output/pdf/apta-agency-example-report-page-centered.pdf','output/pdf/apta-agency-example-report-dividers.pdf');
fs.writeFileSync('tmp/pdfs/center-dividers.cjs',center);
let render=fs.readFileSync('tmp/pdfs/render-page-centered.cjs','utf8').replace('apta-agency-example-report-page-centered.pdf','apta-agency-example-report-dividers.pdf');
fs.writeFileSync('tmp/pdfs/render-dividers.cjs',render);
