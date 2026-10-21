import './tour-illustration.css';

// Decorative wireframes share one coordinate system and semantic theme colors.
function Surface({ x, y, width, height, children, muted = false }) {
  return <g>
    <rect x={x} y={y} width={width} height={height} rx="10" className={muted ? 'tour-art__surface tour-art__surface--muted' : 'tour-art__surface'} />
    {children}
  </g>;
}

function Line({ x, y, width = 40, strong = false }) {
  return <rect x={x} y={y} width={width} height="4" rx="2" className={strong ? 'tour-art__ink' : 'tour-art__line'} />;
}

function Check({ x, y }) {
  return <path d={`M${x} ${y + 4}l4 4 8-8`} className="tour-art__stroke" />;
}

function Avatar({ x, y, size = 24 }) {
  return <g>
    <circle cx={x} cy={y} r={size / 2} className="tour-art__wash" />
    <circle cx={x} cy={y - size * .12} r={size * .14} className="tour-art__ink" />
    <path d={`M${x - size * .24} ${y + size * .24}a${size * .24} ${size * .24} 0 0 1 ${size * .48} 0`} className="tour-art__ink" />
  </g>;
}

function Account() {
  return <>
    <Surface x={57} y={26} width={166} height={128}>
      <Avatar x={84} y={54} size={30} />
      <Line x={110} y={48} width={68} strong /><Line x={110} y={60} width={44} />
      <path d="M71 80h138" className="tour-art__divider" />
      {[97, 125].map((y, i) => <g key={y}>
        <Line x={74} y={y} width={i ? 62 : 48} />
        <rect x="177" y={y - 4} width="28" height="14" rx="7" className={i ? 'tour-art__wash' : 'tour-art__line'} />
        <circle cx={i ? 184 : 198} cy={y + 3} r="4" className="tour-art__paper" />
      </g>)}
    </Surface>
  </>;
}

function Workspace() {
  return <>
    <Surface x={35} y={47} width={96} height={106} muted><rect x="49" y="62" width="20" height="20" rx="5" className="tour-art__line" /><Line x={49} y={95} width={56} /><Line x={49} y={107} width={38} /></Surface>
    <Surface x={151} y={47} width={96} height={106} muted><rect x="211" y="62" width="20" height="20" rx="5" className="tour-art__line" /><Line x={177} y={95} width={54} /><Line x={194} y={107} width={37} /></Surface>
    <Surface x={88} y={25} width={104} height={124}>
      <rect x="104" y="41" width="26" height="26" rx="7" className="tour-art__wash" />
      <rect x="112" y="49" width="10" height="10" rx="2" className="tour-art__ink" />
      <Line x={104} y={81} width={68} strong /><Line x={104} y={93} width={44} />
      <rect x="104" y="111" width="72" height="22" rx="5" className="tour-art__wash" /><Check x={134} y={118} />
    </Surface>
  </>;
}

function Sources() {
  return <>
    <path d="M76 50h42q22 0 22 22v18M76 132h42q22 0 22-22V90m20 0h45" className="tour-art__connector" />
    <Surface x={30} y={28} width={56} height={48}>
      <circle cx="58" cy="52" r="11" className="tour-art__stroke" /><path d="M47 52h22m-11-11c-8 7-8 15 0 22 8-7 8-15 0-22Z" className="tour-art__stroke" />
    </Surface>
    <Surface x={30} y={106} width={56} height={48}>
      {[0, 1, 2].map((i) => <rect key={i} x={45 + i * 10} y={135 - i * 6} width="6" height={8 + i * 6} rx="2" className="tour-art__line" />)}
    </Surface>
    <Surface x={112} y={66} width={56} height={48}>
      <rect x="128" y="82" width="10" height="10" rx="3" className="tour-art__ink" /><rect x="142" y="82" width="10" height="10" rx="3" className="tour-art__line" />
      <Line x={128} y={98} width={24} />
    </Surface>
    <Surface x={202} y={66} width={48} height={48}><Check x={220} y={86} /></Surface>
    <circle cx="98" cy="50" r="3" className="tour-art__ink" /><circle cx="184" cy="90" r="3" className="tour-art__ink" />
  </>;
}

function Insights() {
  return <>
    <Surface x={40} y={30} width={180} height={119}>
      <Line x={55} y={45} width={56} strong />
      <rect x="55" y="63" width="48" height="29" rx="5" className="tour-art__wash" /><Line x={64} y={73} width={20} strong />
      <rect x="111" y="63" width="40" height="29" rx="5" className="tour-art__wash" /><Line x={120} y={73} width={18} />
      <rect x="159" y="63" width="46" height="29" rx="5" className="tour-art__wash" /><Line x={168} y={73} width={22} />
      <path d="M56 128h148" className="tour-art__divider" />
      <path d="m57 119 27-6 22 7 30-17 24 6 32-12" className="tour-art__stroke" />
    </Surface>
    <Surface x={166} y={112} width={77} height={44}><circle cx="184" cy="134" r="9" className="tour-art__wash" /><Check x={178} y={130} /><Line x={201} y={128} width={26} /><Line x={201} y={138} width={18} /></Surface>
  </>;
}

function Performance() {
  return <Surface x={31} y={28} width={218} height={126}>
    <path d="M89 29v124" className="tour-art__divider" />
    {[49, 73, 97, 121].map((y, i) => <g key={y}>
      {i === 1 && <rect x="38" y={y - 7} width="44" height="18" rx="5" className="tour-art__wash" />}
      <rect x="45" y={y} width="6" height="6" rx="2" className={i === 1 ? 'tour-art__ink' : 'tour-art__line'} /><Line x={57} y={y + 1} width={17} />
    </g>)}
    <Line x={106} y={45} width={64} strong /><Line x={106} y={57} width={38} />
    {[90, 112, 134].map((y) => <path key={y} d={`M106 ${y}h125`} className="tour-art__divider" />)}
    {[22, 33, 29, 48, 60, 51].map((height, i) => <rect key={i} x={112 + i * 20} y={134 - height} width="10" height={height} rx="3" className={i === 4 ? 'tour-art__ink' : 'tour-art__line'} />)}
  </Surface>;
}

function Reports() {
  return <>
    <g transform="rotate(-9 140 90)"><Surface x={76} y={27} width={116} height={133} muted /></g>
    <Surface x={87} y={20} width={116} height={140}>
      <rect x="103" y="36" width="18" height="18" rx="5" className="tour-art__wash" /><Line x={131} y={39} width={54} strong /><Line x={131} y={49} width={35} />
      <path d="M103 66h84" className="tour-art__divider" />
      <rect x="103" y="78" width="84" height="38" rx="5" className="tour-art__wash" />
      {[12, 19, 15, 27, 23].map((height, i) => <rect key={i} x={113 + i * 14} y={108 - height} width="8" height={height} rx="2" className={i === 3 ? 'tour-art__ink' : 'tour-art__line'} />)}
      <Line x={103} y={130} width={84} /><Line x={103} y={141} width={58} />
    </Surface>
  </>;
}

function Chat() {
  return <>
    <Surface x={104} y={27} width={133} height={38}><Line x={119} y={40} width={66} /><Line x={119} y={50} width={95} /></Surface>
    <circle cx="45" cy="87" r="12" className="tour-art__wash" />
    <path d="m45 81 2 4 4 2-4 2-2 4-2-4-4-2 4-2Z" className="tour-art__ink" />
    <Surface x={66} y={75} width={142} height={48}><Line x={81} y={89} width={108} /><Line x={81} y={101} width={79} /></Surface>
    <Surface x={42} y={136} width={195} height={26}>
      <Line x={55} y={147} width={65} />
      <circle cx="223" cy="149" r="8" className="tour-art__wash" /><path d="M223 153v-8m-3 3 3-3 3 3" className="tour-art__stroke" />
    </Surface>
  </>;
}

function Access() {
  return <Surface x={50} y={25} width={180} height={130}>
    {[55, 90, 125].map((y, index) => <g key={y}>
      <Avatar x={76} y={y} size={24} />
      <Line x={99} y={y - 5} width={index === 1 ? 55 : 68} strong={index === 0} />
      <Line x={99} y={y + 6} width={38} />
      {index < 2 ? <Check x={199} y={y - 4} /> : <path d={`M205 ${y - 6}v12m-6-6h12`} className="tour-art__stroke" />}
    </g>)}
  </Surface>;
}

function Profile() {
  return <Surface x={65} y={20} width={150} height={140}>
    <Avatar x={140} y={53} size={38} />
    <Line x={111} y={83} width={58} strong />
    <Line x={121} y={95} width={38} />
    <rect x="83" y="112" width="114" height="12" rx="4" className="tour-art__wash" />
    <rect x="83" y="133" width="114" height="12" rx="4" className="tour-art__wash" />
    <Line x={91} y={116} width={52} /><Line x={91} y={137} width={72} />
  </Surface>;
}

const illustrations = { account: Account, access: Access, profile: Profile, workspace: Workspace, sources: Sources, intelligence: Insights, details: Performance, reports: Reports, chat: Chat };

export function TourIllustration({ step, className = 'guided-tour-blank' }) {
  const Illustration = illustrations[step];
  return <div className={`${className} tour-art rounded-md bg-secondary`} aria-hidden="true">
    <svg viewBox="0 0 280 180" focusable="false" className="tour-art__canvas"><Illustration /></svg>
  </div>;
}
