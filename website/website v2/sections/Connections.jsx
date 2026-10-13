import { useEffect, useRef, useState } from 'react'
import { useInView, useReducedMotion } from 'motion/react'
import { Article, ChartLineUp, ChatCircleDots, Database, Globe, UsersThree } from '@phosphor-icons/react'
import { TaskSteps } from '../../../src/components/interior/task-steps'
import { Avatar, AvatarImage } from '../../../src/components/ui/avatar'
import { FrameCard, FrameCardContent } from '../../../src/components/ui/frame-card'
import { MetricLineChart } from '../../../src/features/observatory/_V2/components/search-clicks-chart'
import { ReportStatusDot } from '../../../src/features/observatory/_V2/components/report-status-dot'
import { defaultSignals } from '../../../src/features/orbit-playground/OrbitPlayground'
import { useSavedSetting } from '../../../src/features/orbit-playground/use-saved-setting'
import { WebsiteSection, SectionIntro } from '../components/website-primitives'
import './connections.css'

const groups = [
  { title: 'Your data', icon: Database, logos: [['Google Analytics', '/orbit-logos/googleanalytics.svg'], ['Search Console', '/orbit-logos/googlesearchconsole.svg'], ['Google Ads', '/report-logos/google-ads.svg']] },
  { title: 'Social + rivals', icon: UsersThree, logos: [['Instagram', '/report-logos/instagram.png'], ['LinkedIn', '/orbit-logos/linkedin.svg'], ['TikTok', '/report-logos/tiktok.svg']] },
  { title: 'The open web', icon: Globe, logos: [['ChatGPT', '/provider-logos/openai.svg'], ['Perplexity', '/provider-logos/perplexity.svg'], ['Google News', '/orbit-logos/googlenews.svg']] },
]
const outputs = [{ title: 'Chat', icon: ChatCircleDots }, { title: 'Dashboard', icon: ChartLineUp }, { title: 'Weekly Report', icon: Article }]
const chartData = [12, 19, 16, 28, 25, 36, 43].map((current, index) => ({ day: String(index), current, previous: current * .73 }))
const steps = [
  { id: 'gather', label: 'Gather your signals' },
  { id: 'stories', label: 'Find the stories and insights' },
  { id: 'recommend', label: 'Recommend your next move' },
]

function OutputAsset({ index }) {
  if (index === 0) return <div className="mv-signal-preview mv-signal-preview-chat" aria-hidden="true"><span>What changed this week?</span><p>Search clicks rose <strong>6.8%</strong> as the new pages gained visibility.</p><i /><i /></div>
  if (index === 1) return <div className="mv-signal-preview mv-signal-preview-chart" aria-hidden="true"><span>Search clicks</span><strong>2,217</strong><MetricLineChart variant="lines" compact data={chartData} /></div>
  return <div className="mv-signal-preview mv-signal-preview-report" aria-hidden="true"><div><ReportStatusDot unread /><span>Your weekly read</span></div><strong>Monday, in focus</strong><i /><i /><i /></div>
}

export function Connections() {
  const root = useRef(null)
  const center = useRef(null)
  const sources = useRef([])
  const destinations = useRef([])
  const [paths, setPaths] = useState([])
  const [step, setStep] = useState(0)
  const [signals] = useSavedSetting('signals', defaultSignals)
  const inView = useInView(root, { amount: 0.15 })
  const reduced = useReducedMotion()

  useEffect(() => {
    if (!inView || reduced) return
    const timer = setInterval(() => {
      if (!document.hidden) setStep(value => (value + 1) % (steps.length + 1))
    }, 2400)
    return () => clearInterval(timer)
  }, [inView, reduced])

  useEffect(() => {
    const element = root.current
    let frame
    const measure = () => {
      const bounds = element.getBoundingClientRect()
      const hub = center.current.querySelector('.mv-signal-hub-card').getBoundingClientRect()
      const stacked = window.matchMedia('(max-width:900px)').matches
      const build = (card, incoming, index) => {
        const box = card.getBoundingClientRect()
        const anchor = (incoming ? card.querySelector('.mv-signal-source-card') : card.querySelector('.mv-signal-output-card')).getBoundingClientRect()
        const start = stacked
          ? (incoming ? { x: box.left + box.width / 2, y: box.bottom } : { x: hub.left + hub.width / 2, y: hub.bottom })
          : (incoming ? { x: anchor.right, y: anchor.top + anchor.height / 2 } : { x: hub.right, y: hub.top + hub.height / 2 })
        const end = stacked
          ? (incoming ? { x: hub.left + hub.width / 2, y: hub.top } : { x: box.left + box.width / 2, y: box.top })
          : (incoming ? { x: hub.left, y: hub.top + hub.height / 2 } : { x: anchor.left + 2, y: index === 1 ? hub.top + hub.height / 2 : anchor.top + anchor.height / 2 })
        const x1 = start.x - bounds.left, y1 = start.y - bounds.top, x2 = end.x - bounds.left, y2 = end.y - bounds.top
        if (stacked) return `M ${x1} ${y1} C ${x1} ${(y1 + y2) / 2} ${x2} ${(y1 + y2) / 2} ${x2} ${y2}`
        const direction = Math.sign(y2 - y1)
        if (!direction) return `M ${x1} ${y1} H ${x2}`
        const middle = (x1 + x2) / 2
        const radius = Math.min(44, Math.abs(y2 - y1) / 2, (x2 - x1) / 4)
        return `M ${x1} ${y1} H ${middle - radius} C ${middle - radius * .45} ${y1} ${middle} ${y1 + direction * radius * .45} ${middle} ${y1 + direction * radius} V ${y2 - direction * radius} C ${middle} ${y2 - direction * radius * .45} ${middle + radius * .45} ${y2} ${middle + radius} ${y2} H ${x2}`
      }
      setPaths([...sources.current.map((card, index) => build(card, true, index)), ...destinations.current.map((card, index) => build(card, false, index))])
    }
    const schedule = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(measure) }
    const observer = new ResizeObserver(schedule)
    ;[element, center.current, center.current.querySelector('.mv-signal-hub-card'), ...sources.current, ...sources.current.map(node => node.querySelector('.mv-signal-source-card')), ...destinations.current, ...destinations.current.map(node => node.querySelector('.mv-signal-output-card'))].forEach(node => observer.observe(node))
    window.addEventListener('resize', schedule)
    schedule()
    return () => { observer.disconnect(); cancelAnimationFrame(frame); window.removeEventListener('resize', schedule) }
  }, [])

  return <WebsiteSection id="connections" className="mv-connections-band" labelledBy="connections-heading">
    <SectionIntro id="connections-heading" title="Access your data in plain language, in one place. Work with it in chat." />
    <div ref={root} className="mv-signal-flow" data-reveal-item aria-label="Your data, social signals, and the open web become insights in chat, dashboard, and weekly reports">
      <svg className="mv-signal-paths" width="100%" height="100%" aria-hidden="true">
        {paths.map((path, index) => <path key={index} d={path} fill="none" stroke="var(--color-neutral-400)" strokeOpacity=".35" strokeWidth="1" />)}
        {inView && !reduced && signals.enabled && paths.length > 0 && Array.from({ length: Math.max(0, signals.count) }, (_, index) => <circle key={index} r="0" fill={signals.themeColor !== false ? 'var(--foreground)' : signals.color}>
          <animateMotion dur={`${signals.duration}s`} begin={`${index * signals.duration / Math.max(1, signals.count)}s`} repeatCount="indefinite" path={paths[index % paths.length]} calcMode="spline" keyTimes="0;1" keySplines="0.42 0 0.58 1" />
          <animate attributeName="r" values={`0;${0.32 * signals.size * 5};${0.32 * signals.size * 5};0`} keyTimes="0;.1;.92;1" dur={`${signals.duration}s`} begin={`${index * signals.duration / Math.max(1, signals.count)}s`} repeatCount="indefinite" />
        </circle>)}
      </svg>
      <div className="mv-signal-column mv-signal-sources">
        {groups.map((group, index) => <div className="mv-signal-source" key={group.title} ref={node => { sources.current[index] = node }}>
          <FrameCard withFill className="mv-signal-source-card"><FrameCardContent>
            <h3><group.icon aria-hidden="true" />{group.title}</h3>
            <ul className="mv-signal-logos">{group.logos.map(([name, src]) => <li key={name} title={name}><Avatar className={`mv-signal-avatar mv-signal-avatar-${name.toLowerCase().replace(/[^a-z]+/g, '-')}`}><AvatarImage src={src} alt={name} /></Avatar></li>)}</ul>
          </FrameCardContent></FrameCard>
        </div>)}
      </div>
      <div ref={center} className="mv-signal-hub">
        <FrameCard withFill className="mv-signal-hub-card"><FrameCardContent>
          <TaskSteps steps={steps} current={step} label="How Moonvine turns signals into insights" className="mv-signal-task-steps" />
        </FrameCardContent></FrameCard>
      </div>
      <div className="mv-signal-column mv-signal-destinations">
        {outputs.map((output, index) => <div className="mv-signal-destination" key={output.title} ref={node => { destinations.current[index] = node }}><FrameCard withFill className="mv-signal-output-card"><FrameCardContent><h3><output.icon aria-hidden="true" />{output.title}</h3><OutputAsset index={index} /></FrameCardContent></FrameCard></div>)}
      </div>
    </div>
  </WebsiteSection>
}
