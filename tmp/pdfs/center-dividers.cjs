const fs=require('fs');
const {createCanvas,DOMMatrix,ImageData,Path2D}=require('./runtime/node_modules/@napi-rs/canvas');
Object.assign(globalThis,{DOMMatrix,ImageData,Path2D});
(async()=>{
const {PDFDocument,rgb}=require('./runtime/node_modules/pdf-lib');
const pdfjs=await import('./runtime/node_modules/pdfjs-dist/legacy/build/pdf.mjs');
const input=fs.readFileSync('tmp/pdfs/report-divider-base.pdf');
const source=await PDFDocument.load(input),out=await PDFDocument.create();
const render=await pdfjs.getDocument({data:new Uint8Array(input),useSystemFonts:true}).promise;
for(let i=0;i<source.getPageCount();i++){
 const p=await render.getPage(i+1),v=p.getViewport({scale:1}),c=createCanvas(v.width,v.height),ctx=c.getContext('2d');
 await p.render({canvasContext:ctx,viewport:v}).promise;
 const d=ctx.getImageData(0,0,c.width,c.height).data;
 let first=c.height,last=0;
 for(let y=0;y<c.height;y++){
  let count=0,min=255,max=0;
  for(let x=Math.floor(c.width*.185);x<Math.ceil(c.width*.815);x++){
   const k=(y*c.width+x)*4,b=Math.max(d[k],d[k+1],d[k+2]);min=Math.min(min,b);max=Math.max(max,b);if(b>20)count++;
  }
  if(count>2&&max-min>3){first=Math.min(first,y);last=y;}
 }
 const top=Math.max(0,first-18),bottom=Math.min(c.height,last+19),height=bottom-top;
 const {width:pw,height:ph}=source.getPage(i).getSize();
 const embedded=await out.embedPage(source.getPage(i),{left:30,right:pw-30,bottom:0,top:ph});
 const page=out.addPage([pw,ph]);page.drawRectangle({x:0,y:0,width:pw,height:ph,color:rgb(17/255,17/255,17/255)});
 page.drawPage(embedded,{x:30,y:(ph-height)/2-(ph-bottom),width:pw-60,height:ph});
 console.log({page:i+1,top,bottom,height,margin:(ph-height)/2});
}
fs.writeFileSync('output/pdf/apta-agency-example-report-dividers.pdf',await out.save());
})();



