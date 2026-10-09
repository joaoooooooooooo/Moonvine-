import { useEffect, useRef, useState } from 'react'
import { useInView, useReducedMotion } from 'motion/react'
import { ChatCircleDots, ChartLineUp, EnvelopeSimple, Check } from '@phosphor-icons/react'
import { FrameCard, FrameCardContent } from '../../../src/components/ui/frame-card'
import { MetricLineChart } from '../../../src/features/observatory/_V2/components/search-clicks-chart'
import { ReportStatusDot } from '../../../src/features/observatory/_V2/components/report-status-dot'
import wordmark from '../../../src/assets/Logo type - Light.svg'
import { WebsiteSection, SectionIntro } from '../components/website-primitives'
import './connections.css'

const groups = [
  { title: 'Your data', detail: 'Connected sources', logos: [['Google Analytics','/orbit-logos/googleanalytics.svg'],['Search Console','/orbit-logos/googlesearchconsole.svg'],['Google Ads','/report-logos/google-ads.svg'],['Site health','/orbit-logos/pagespeedinsights.svg']] },
  { title: 'The open web', detail: 'A wider perspective', logos: [['ChatGPT','/provider-logos/openai.svg'],['Perplexity','/provider-logos/perplexity.svg'],['Google News','/orbit-logos/googlenews.svg']] },
  { title: 'Social + rivals', detail: 'Your competitive context', logos: [['Instagram','/orbit-logos/instagram.svg'],['LinkedIn','/orbit-logos/linkedin.svg'],['TikTok','/report-logos/tiktok.svg'],['YouTube','/orbit-logos/youtube.svg'],['Competitors','/orbit-logos/semrush.svg']] },
]
const outputs = [
  { title: 'Chat', description: 'Ask anything. Get a clear read.', icon: ChatCircleDots },
  { title: 'Dashboard', description: 'Every channel, in context.', icon: ChartLineUp },
  { title: 'Weekly report', description: 'Your Monday marketing audit.', icon: EnvelopeSimple },
]
const steps = ['Gather your signals', 'Find the stories and insights', 'Recommend your next move']
const sample = [12,19,16,28,25,36,43].map((current,index)=>({day:String(index),current,previous:current*.73}))
function Preview({ index }) {
  if (index === 0) return <div className="mv-signal-mini mv-signal-chat" aria-hidden="true"><span>What changed?</span><p>Search is up <strong>6.8%.</strong></p><i /><i /></div>
  if (index === 1) return <div className="mv-signal-mini mv-signal-chart" aria-hidden="true"><span>Search clicks</span><strong>2,217</strong><MetricLineChart variant="lines" compact data={sample} /></div>
  return <div className="mv-signal-mini mv-signal-email" aria-hidden="true"><div><ReportStatusDot unread /><span>Your weekly read</span></div><i /><i /><i /><span className="mv-signal-email-foot"><Check size={12} />Ready for Monday</span></div>
}
export function Connections() {
  const root = useRef(null)
  const center = useRef(null)
  const sources = useRef([])
  const destinations = useRef([])
  const [paths, setPaths] = useState([])
  const [step, setStep] = useState(0)
  const inView = useInView(root, { amount: 0.15 })
  const reduced = useReducedMotion()
  useEffect(() => {
    if (!inView || reduced) return
    const timer = setInterval(() => { if (!document.hidden) setStep(value => (value + 1) % steps.length) }, 2400)
    return () => clearInterval(timer)
  }, [inView, reduced])
  useEffect(() => {
    const element = root.current
    let frame
    const measure = () => {
      const bounds = element.getBoundingClientRect()
      const hub = center.current.getBoundingClientRect()
      const stacked = window.matchMedia('(max-width:900px)').matches
      const build = (card, incoming) => {
        const box = card.getBoundingClientRect()
        const start = stacked
          ? (incoming ? {x:box.left+box.width/2,y:box.bottom} : {x:hub.left+hub.width/2,y:hub.bottom})
          : (incoming ? {x:box.right,y:box.top+box.height/2} : {x:hub.right,y:hub.top+hub.height/2})
        const end = stacked
          ? (incoming ? {x:hub.left+hub.width/2,y:hub.top} : {x:box.left+box.width/2,y:box.top})
          : (incoming ? {x:hub.left,y:hub.top+hub.height/2} : {x:box.left,y:box.top+box.height/2})
        const x1=start.x-bounds.left,y1=start.y-bounds.top,x2=end.x-bounds.left,y2=end.y-bounds.top
        return stacked ? `M ${x1} ${y1} C ${x1} ${(y1+y2)/2} ${x2} ${(y1+y2)/2} ${x2} ${y2}` : `M ${x1} ${y1} C ${(x1+x2)/2} ${y1} ${(x1+x2)/2} ${y2} ${x2} ${y2}`
      }
      setPaths([...sources.current.map(card=>build(card,true)),...destinations.current.map(card=>build(card,false))])
    }
    const schedule = () => { cancelAnimationFrame(frame); frame=requestAnimationFrame(measure) }
    const observer = new ResizeObserver(schedule)
    ;[element,center.current,...sources.current,...destinations.current].forEach(node=>observer.observe(node))
    window.addEventListener('resize',schedule)
    schedule()
    return () => { observer.disconnect();cancelAnimationFrame(frame);window.removeEventListener('resize',schedule) }
  }, [])
  return <WebsiteSection id="connections" className="mv-connections-band" labelledBy="connections-heading">
    <SectionIntro id="connections-heading" title="Plug and play" description="Your data, the open web, and your competitors. Read together. Delivered with a clear next step." />
    <div ref={root} className="mv-signal-flow" data-reveal-item aria-label="Your data, open web and social signals become insights in chat, dashboard and weekly reports">
      <svg className="mv-signal-paths" width="100%" height="100%" aria-hidden="true">
        {paths.map((path,index)=><g key={path}><path d={path} fill="none" stroke="var(--color-neutral-400)" strokeOpacity=".35" strokeWidth="1" />{inView && !reduced && <circle r="2.5" fill="var(--foreground)"><animateMotion dur="3.6s" begin={`${index*.4}s`} repeatCount="indefinite" path={path} /></circle>}</g>)}
      </svg>
      <div className="mv-signal-column">
        {groups.map((group,index)=><div key={group.title} ref={node=>{sources.current[index]=node}}><FrameCard withFill className="mv-signal-card"><FrameCardContent><div className="mv-signal-source-title"><h3>{group.title}</h3><span>{group.detail}</span></div><ul className="mv-signal-logos">{group.logos.map(([name,src])=><li key={name} title={name}><span role="img" aria-label={name} style={{maskImage:`url("${src}")`,WebkitMaskImage:`url("${src}")`}} /></li>)}</ul></FrameCardContent></FrameCard></div>)}
      </div>
      <div ref={center} className="mv-signal-hub"><FrameCard withFill className="mv-signal-card"><FrameCardContent>
        <img className="mv-signal-wordmark" src={wordmark} alt="Moonvine" />
        <ol className="mv-signal-steps">{steps.map((label,index)=><li key={label} className={step===index?'is-current':''}><span>{String(index+1).padStart(2,'0')}</span>{label}</li>)}</ol>
        <p>One connected view.<br />A clearer next step.</p>
      </FrameCardContent></FrameCard></div>
      <div className="mv-signal-column">
        {outputs.map(({title,description,icon:Icon},index)=><div key={title} ref={node=>{destinations.current[index]=node}}><FrameCard withFill className="mv-signal-card mv-signal-output"><FrameCardContent><div><Icon size={20} weight="regular" aria-hidden="true" /><h3>{title}</h3><p>{description}</p></div><Preview index={index} /></FrameCardContent></FrameCard></div>)}
      </div>
    </div>
  </WebsiteSection>
}
