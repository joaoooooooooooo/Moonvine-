const { chromium } = require('playwright');
const assert = require('node:assert/strict');
(async()=>{
 const b=await chromium.launch();
 try{
  const p=await b.newPage({viewport:{width:1400,height:1050}});
  p.setDefaultTimeout(10000);
  const errors=[];p.on('pageerror',e=>errors.push(e.message));
  await p.goto('http://localhost:5173/#/brand-tools/citation');
  await p.getByRole('button',{name:'Pause',exact:true}).click();
  assert.equal(await p.getByRole('heading',{name:'Content',exact:true}).count(),0);
  assert.equal(await p.getByText('Full resolution',{exact:false}).count(),0);
  const before=await p.locator('canvas[role=img]').evaluate(c=>c.toDataURL());
  for(const [label,key,press]of [['Asset size','size','ArrowRight'],['Horizontal offset','x','ArrowRight'],['Vertical offset','y','ArrowLeft']]){
   const s=p.getByRole('slider',{name:label,exact:true});await s.focus();await s.press(press);
   const stored=await p.evaluate(()=>JSON.parse(localStorage.getItem('moonvine.citation.v1')));
   assert.equal(stored.assetSettings['orbit:portrait'][key],key==='size'?101:key==='x'?1:-1);
  }
  assert.notEqual(await p.locator('canvas[role=img]').evaluate(c=>c.toDataURL()),before);
  await p.getByRole('tab',{name:'Landscape'}).click();
  assert.equal(await p.getByRole('slider',{name:'Asset size',exact:true}).getAttribute('aria-valuenow'),'100');
  await p.getByRole('tab',{name:'Portrait'}).click();
  assert.equal(await p.getByRole('slider',{name:'Asset size',exact:true}).getAttribute('aria-valuenow'),'101');
  await p.reload();
  assert.equal(await p.getByRole('slider',{name:'Asset size',exact:true}).getAttribute('aria-valuenow'),'101');
  for(const label of ['Stepper 01','Stepper 02','Stepper 03','Stepper 04','Orbit']){
   await p.getByRole('combobox',{name:'Animation',exact:true}).click();
   await p.getByRole('option',{name:label,exact:true}).click();
   await p.waitForTimeout(1100);
   assert.equal(await p.getByRole('slider',{name:'Asset size',exact:true}).getAttribute('aria-valuenow'),label==='Orbit'?'101':'100');
   await p.locator('canvas[role=img]').screenshot({path:`tmp/placed-${label.replaceAll(' ','-')}.png`});
   const pixels=await p.locator('canvas[role=img]').evaluate(c=>{const d=c.getContext('2d').getImageData(0,720,c.width,c.height-720).data;let n=0;for(let i=0;i<d.length;i+=4)if(d[i]>80)n++;return n});
   assert.ok(pixels>100,label+' must render in the lower artwork area');
   console.log(label,pixels);
  }
  await p.getByRole('button',{name:'Reset placement',exact:true}).click();
  assert.equal(await p.getByRole('slider',{name:'Asset size',exact:true}).getAttribute('aria-valuenow'),'100');
  assert.equal(await p.getByRole('slider',{name:'Horizontal offset',exact:true}).getAttribute('aria-valuenow'),'0');
  await p.screenshot({path:'tmp/asset-placement-controls.png'});
  assert.deepEqual(errors,[]);
  console.log('PASS: asset controls update canvas, per-format and per-animation state, persistence, calibrated rendering, reset, removed labels, no runtime errors');
 }finally{await b.close()}
})().catch(e=>{console.error(e);process.exit(1)});
