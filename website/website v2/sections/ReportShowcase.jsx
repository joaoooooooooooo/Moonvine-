import { useEffect, useRef, useState } from 'react'
import React from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { IntroSection } from '../../../src/features/Reports/sections/Intro Section'
import { SourcesSection } from '../../../src/features/Reports/sections/Sources Section'
import { OverviewSection } from '../../../src/features/Reports/sections/Overview Section'
import { AiVisibilitySection } from '../../../src/features/Reports/sections/AI Visibility Section'
import { WebsiteAuditSection } from '../../../src/features/Reports/sections/Website Audit Section'
import { NextStepsSection } from '../../../src/features/Reports/sections/Next Steps Section'
import { ReportProvider } from '../../../src/features/Reports/context'
import { reportMock } from '../../../src/features/Reports/report.mock'
import { Tabs, TabsList, TabsTrigger } from '../../../src/features/Reports/components/nav/components/nav-tabs'
import { Button } from '../../../src/components/ui/button'
import { Calendar } from '../../../src/components/ui/calendar'
import { FrameCard, FrameCardContent } from '../../../src/components/ui/frame-card'
import { useReportVisualSettings } from './ReportShowcaseControls'
import { WebsiteSection, StaggeredHeading } from '../components/website-primitives'
import './report-showcase.css'

const REPORT_VIEWPORT_WIDTH = 1300
const reportMondays = [2, 9, 16, 23, 30]
const reportMondayColors = ['#f5f5f4', '#9200e8', '#ff9f0a', '#08b87b', '#2764ff']
function MondayCalendar() {
  const [activeMonday, setActiveMonday] = useState(0)
  useEffect(() => {
    const timer = window.setInterval(() => setActiveMonday(index => (index + 1) % reportMondays.length), 1200)
    return () => window.clearInterval(timer)
  }, [])
  return <FrameCard withFill className="mv-report-calendar-preview" aria-hidden="true" inert style={{ '--calendar-accent': reportMondayColors[activeMonday], '--calendar-accent-foreground': activeMonday === 0 ? '#171717' : '#fff' }}>
    <FrameCardContent className="mv-report-calendar-frame">
      <Calendar key={activeMonday} mode="single" month={new Date(2026, 10, 1)} hideNavigation components={{ MonthCaption: () => null }} modifiers={{ activeMonday: new Date(2026, 10, reportMondays[activeMonday]) }} modifiersClassNames={{ activeMonday: 'mv-calendar-active-monday' }} className="mv-report-calendar" />
    </FrameCardContent>
  </FrameCard>
}
const sections = [
  { id: 'overview', label: 'Overview' },
  { id: 'sources', label: 'Sources' },
  { id: 'market', label: 'Market' },
  { id: 'ai', label: 'AI visibility' },
  { id: 'website', label: 'Website audit' },
  { id: 'next', label: 'Next steps' },
]
function ReportPreviewContent({ section }) {
  switch (section) {
    case 'sources': return <div className="mv-report-sources"><SourcesSection data={reportMock.sources} /></div>
    case 'market': return <OverviewSection data={reportMock.overview} />
    case 'ai': return <AiVisibilitySection data={reportMock.aiVisibility} />
    case 'website': return <WebsiteAuditSection data={reportMock.websiteAudit} />
    case 'next': return <NextStepsSection data={reportMock.nextSteps} />
    default: return <IntroSection id="website-report-preview" data={reportMock.intro} reportUrl="https://moonvine-ds.vercel.app/#/reports" />
  }
}
export function ReportHeroPreview() {
  const [section, setSection] = useState('overview')
  const [background, setBackground] = useState('card')
  useEffect(() => {
    document.documentElement.style.background = 'var(--card)'
    document.documentElement.style.overflow = 'hidden'
    const receive = event => {
      if (event.origin !== window.location.origin || event.source !== window.parent || event.data?.type !== 'moonvine:report-preview') return
      if (sections.some(item => item.id === event.data.section)) setSection(event.data.section)
      if (['card', 'background'].includes(event.data.background)) {
        setBackground(event.data.background)
        document.documentElement.style.background = `var(--${event.data.background})`
      }
    }
    window.addEventListener('message', receive)
    return () => window.removeEventListener('message', receive)
  }, [])
  return <ReportDesktop section={section} background={background} />
}
const ReportDesktop = React.memo(function ReportDesktop({ section, background }) {
  const reduced = useReducedMotion()
  return <div className="mv-report-desktop" style={{ background: `var(--${background})` }}>
    <ReportProvider value={reportMock.context}>
      <Tabs value={section} variant="underline" className="mv-report-nav"><TabsList>{sections.map(item => <TabsTrigger key={item.id} value={item.id}>{item.label}</TabsTrigger>)}</TabsList></Tabs>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={section} initial={{ opacity: 0, transform: 'translateY(12px)' }} animate={{ opacity: 1, transform: 'translateY(0px)' }} exit={{ opacity: 0, transform: 'translateY(-8px)' }} transition={{ duration: reduced ? 0 : 0.24, ease: [0.22, 1, 0.36, 1] }}>
          <ReportPreviewContent section={section} />
        </motion.div>
      </AnimatePresence>
    </ReportProvider>
  </div>
})
export function ReportShowcase() {
  const sectionRef = useRef(null)
  const [visual] = useReportVisualSettings()
  const assetRef = useRef(null)
  const [scale, setScale] = useState(0.5)
  const [section, setSection] = useState('overview')
  const [revealed, setRevealed] = useState(false)
  useEffect(() => {
    if (revealed) return
    let frame = 0
    const updateReveal = () => {
      frame = 0
      const bounds = sectionRef.current?.getBoundingClientRect()
      if (!bounds) return
      if (bounds.top <= window.innerHeight * .76) setRevealed(true)
    }
    const scheduleReveal = () => { if (!frame) frame = requestAnimationFrame(updateReveal) }
    updateReveal()
    window.addEventListener('scroll', scheduleReveal, { passive: true })
    window.addEventListener('resize', scheduleReveal)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', scheduleReveal)
      window.removeEventListener('resize', scheduleReveal)
    }
  }, [revealed])
  useEffect(() => {
    const asset = assetRef.current
    const resize = new ResizeObserver(([entry]) => setScale(entry.contentRect.width / REPORT_VIEWPORT_WIDTH))
    resize.observe(asset)
    return () => resize.disconnect()
  }, [REPORT_VIEWPORT_WIDTH])
  return <WebsiteSection id="reports" className="mv-report-band mv-theme-dark" labelledBy="reports-title" reveal={false}>
    <div ref={sectionRef} className="mv-report-layout" onFocusCapture={() => setRevealed(true)}>
      <div className="mv-report-visual" style={{ width: `${visual.size}%`, '--report-background': `var(--${visual.assetBackground})` }}>
        <FrameCard withFill className="mv-report-asset-shadow" style={{ '--reveal-stagger': 0 }} data-section-reveal={revealed ? 'visible' : 'pending'}>
          <FrameCardContent className="mv-report-asset-frame">
            <div ref={assetRef} id="report-section-preview" className="mv-report-asset" aria-label="Weekly report preview">
              <div className="mv-report-frame" style={{ transform: `scale(${scale})` }} inert aria-hidden="true"><ReportDesktop section={section} background={visual.assetBackground} /></div>
            </div>
          </FrameCardContent>
        </FrameCard>
        <MondayCalendar />
      </div>
      <div className="mv-report-copy" style={{ '--reveal-stagger': 1 }} data-section-reveal={revealed ? 'visible' : 'pending'}>
        <StaggeredHeading id="reports-title" className="mv-report-heading">A marketing and competitor audit every Monday.</StaggeredHeading>
        <div className="mv-report-section-nav" role="group" aria-label="Preview report sections">
          {[sections.slice(0, 3), sections.slice(3)].map((row, index) => <div className="mv-report-section-row" key={index}>
            {row.map(item => <Button key={item.id} variant={section === item.id ? 'default' : 'ghost'} aria-pressed={section === item.id} aria-controls="report-section-preview" onClick={() => setSection(item.id)}>{item.label}</Button>)}
          </div>)}
        </div>
        <span className="sr-only" role="status">Showing {sections.find(item => item.id === section).label} report preview</span>
      </div>
    </div>
  </WebsiteSection>
}
