const { chromium } = require('playwright');
const fs = require('node:fs/promises');
(async () => {
 const browser = await chromium.launch();
 try {
  const page = await browser.newPage({viewport:{width:1400,height:1000}});
  await page.goto('http://localhost:5173/#/brand-tools/citation');
  const results=[];
  for(const label of ['Orbit','Stepper 01','Stepper 02','Stepper 03','Stepper 04']) {
   await page.getByRole('combobox',{name:'Animation',exact:true}).click();
   await page.getByRole('option',{name:label,exact:true}).click();
   await page.getByRole('button',{name:'Replay',exact:true}).click();
   const bounds=await page.evaluate(async()=>{
    let union={left:Infinity,top:Infinity,right:0,bottom:0};
    let frames=[];
    for(let sample=0;sample<10;sample++){
     await new Promise(r=>setTimeout(r,500));
     const c=document.querySelector('body > canvas');
     if(!c)continue;
     const d=c.getContext('2d').getImageData(0,0,c.width,c.height).data;
     let box={left:Infinity,top:Infinity,right:0,bottom:0},count=0;
     for(let y=0;y<c.height;y++)for(let x=0;x<c.width;x++){if(d[(y*c.width+x)*4+3]>24){box.left=Math.min(box.left,x);box.top=Math.min(box.top,y);box.right=Math.max(box.right,x);box.bottom=Math.max(box.bottom,y);count++;}}
     if(count){union={left:Math.min(union.left,box.left),top:Math.min(union.top,box.top),right:Math.max(union.right,box.right),bottom:Math.max(union.bottom,box.bottom)};frames.push({...box,count});}
    }
    return {union,frames};
   });
   const url=await page.locator('body > canvas').evaluate(c=>c.toDataURL());
   await fs.writeFile('tmp/asset-'+label.replaceAll(' ','-')+'.png',Buffer.from(url.split(',')[1],'base64'));
   results.push({label,...bounds});
   console.log(JSON.stringify({label,...bounds}));
  }
  await fs.writeFile('tmp/asset-bounds.json',JSON.stringify(results,null,2));
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exit(1)});

