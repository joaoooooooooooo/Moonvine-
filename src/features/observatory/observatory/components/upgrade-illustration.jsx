import './guided-tour/tour-illustration.css';

function Panel({ x = 40, y = 28, w = 200, h = 126, children }) {
  return <g><rect x={x} y={y} width={w} height={h} rx="10" className="tour-art__surface" />{children}</g>;
}
function Line({ x, y, w = 40, strong = false }) {
  return <rect x={x} y={y} width={w} height="4" rx="2" className={strong ? 'tour-art__ink' : 'tour-art__line'} />;
}
function Analytics() {
  return <><Panel x={32} w={185}><Line x={48} y={44} w={61} strong /><path d="M49 126h148M49 98h148M49 74h148" className="tour-art__divider" /><path d="m50 119 23-8 23 4 24-28 25 10 24-30 25 8" className="tour-art__stroke" /><circle cx="169" cy="67" r="4" className="tour-art__ink" /></Panel><Panel x={181} y={103} w={65} h={53}>{[10,20,30].map((h,i)=><rect key={h} x={194+i*13} y={144-h} width="7" height={h} rx="2" className={i===2?'tour-art__ink':'tour-art__line'} />)}</Panel></>;
}
function Search() {
  return <Panel><rect x="53" y="41" width="174" height="25" rx="7" className="tour-art__wash" /><circle cx="66" cy="52" r="5" className="tour-art__stroke" /><path d="m70 56 4 4" className="tour-art__stroke" /><Line x={85} y={51} w={87} />{[82,106,130].map((y,i)=><g key={y}><Line x={55} y={y} w={105-i*22} strong={i===0} /><Line x={55} y={y+9} w={128-i*18} /><path d={'M200 '+(y+8)+'v-8m-4 4 4-4 4 4'} className="tour-art__stroke" /></g>)}</Panel>;
}
function AI() {
  return <><path d="M61 54 139 90l77-38M139 90l-55 54m55-54 74 45" className="tour-art__connector" />{[[27,26,86],[177,22,73],[32,123,92],[183,119,63]].map(([x,y,w])=><Panel key={x} x={x} y={y} w={w} h={42}><Line x={x+12} y={y+13} w={w-24} /><Line x={x+12} y={y+25} w={w-36} /></Panel>)}<circle cx="139" cy="90" r="29" className="tour-art__surface" /><path d="M139 75q0 15 15 15-15 0-15 15 0-15-15-15 15 0 15-15Z" className="tour-art__stroke" /></>;
}
function Investor() {
  return <Panel><Line x={57} y={44} w={75} strong />{[24,39,32,57,68].map((h,i)=><g key={i}><path d={'M'+(72+i*31)+' '+(122-h)+'v'+(h+20)} className="tour-art__connector" /><rect x={66+i*31} y={132-h} width="12" height={h} rx="3" className={i===4?'tour-art__ink':'tour-art__line'} /></g>)}</Panel>;
}
function Social() {
  return <><Panel x={39} y={39} w={102} h={113}><circle cx="57" cy="56" r="7" className="tour-art__line" /><Line x={71} y={53} w={49} /><rect x="51" y="73" width="78" height="48" rx="5" className="tour-art__wash" /><path d="m55 115 20-23 14 12 17-22 19 33" className="tour-art__connector" /><Line x={52} y={134} w={60} /></Panel><Panel x={155} y={25} w={84} h={96}><Line x={167} y={40} w={46} strong /><Line x={167} y={53} w={58} /><Line x={167} y={65} w={41} /><path d="M180 99c-26-15-6-27 0-17 6-10 26 2 0 17Z" className="tour-art__stroke" /></Panel><Panel x={168} y={133} w={75} h={28}><Line x={181} y={145} w={48} /></Panel></>;
}
function Media({ feed = false }) {
  return <><Panel x={40} w={174}><Line x={55} y={44} w={98} strong /><path d="M55 59h143" className="tour-art__divider" /><rect x="55" y="72" width="51" height="51" rx="5" className="tour-art__wash" /><Line x={118} y={74} w={66} strong /><Line x={118} y={87} w={77} /><Line x={118} y={100} w={62} /><Line x={55} y={134} w={129} /></Panel>{feed?<>{[49,100].map(y=><Panel key={y} x={189} y={y} w={64} h={39}><Line x={200} y={y+12} w={41} /><Line x={200} y={y+24} w={28} /></Panel>)}</>:<g><circle cx="222" cy="125" r="22" className="tour-art__surface" /><path d="m211 125 8 7 14-17" className="tour-art__stroke" /></g>}</>;
}
function Health() {
  return <Panel><Line x={55} y={44} w={61} /><path d="M41 62h198" className="tour-art__divider" /><path d="M61 119a35 35 0 0 1 70 0" className="tour-art__connector" /><path d="M61 119a35 35 0 0 1 58-26m-23 26 19-19" className="tour-art__stroke" /><circle cx="96" cy="119" r="4" className="tour-art__ink" />{[84,108,132].map(y=><g key={y}><path d={'m151 '+y+' 4 4 7-9'} className="tour-art__stroke" /><Line x={174} y={y} w={46} /></g>)}</Panel>;
}
function Competitors() {
  return <Panel><Line x={55} y={42} w={84} strong />{[72,105,138].map((y,i)=><g key={y}><circle cx="65" cy={y-2} r="10" className="tour-art__surface" /><path d={'m61 '+(y+1)+' 4-7 4 7Z'} className="tour-art__stroke" /><rect x="85" y={y-7} width={124-i*28} height="10" rx="3" className={i===0?'tour-art__ink':'tour-art__line'} /></g>)}</Panel>;
}
function Report() {
  return <><Panel x={56} y={37} w={132} h={123}><Line x={72} y={53} w={71} /><Line x={72} y={66} w={94} /></Panel><Panel x={91} y={20} w={128} h={132}><Line x={107} y={36} w={82} strong /><Line x={107} y={49} w={56} /><rect x="107" y="66" width="96" height="37" rx="5" className="tour-art__wash" /><path d="m115 95 17-13 18 5 18-14 25 3" className="tour-art__stroke" /><Line x={107} y={116} w={93} /><Line x={107} y={129} w={70} /></Panel></>;
}
const scenes = { 'insight:ai-visibility': AI, 'insight:investor': Investor, 'source:ga4': Analytics, 'source:ga4-2': Analytics, 'source:gsc': Search, 'source:social': Social, 'source:news': Media, 'source:site': Health, 'source:semrush': Competitors, 'report:history': Report, 'intelligence:chat': AI };
export function UpgradeIllustration({ lensId }) {
  const Scene = scenes[lensId] ?? Report;
  return <div className="tour-art upgrade-art" aria-hidden="true"><svg viewBox="0 0 280 180" className="tour-art__canvas" focusable="false">{lensId === 'source:news-media' ? <Media feed /> : <Scene />}</svg></div>;
}
