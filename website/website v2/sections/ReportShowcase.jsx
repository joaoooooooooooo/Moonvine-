import { useAssetFade, assetFadeStyle } from '../components/asset-fade'
﻿import { useEffect, useRef, useState } from 'react'
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
import { ReportStatusDot } from '../../../src/features/observatory/_V2/components/report-status-dot'
import { FrameCard, FrameCardContent } from '../../../src/components/ui/frame-card'
import { Button } from '../../../src/components/ui/button'
import { CalendarBlank } from '@phosphor-icons/react'
import { useReportVisualSettings } from './ReportShowcaseControls'
import { WebsiteSection } from '../components/website-primitives'
import './report-showcase.css'

const REPORT_VIEWPORT_WIDTH = 1300
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
  const reduced = useReducedMotion()
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
  return <div className="mv-report-desktop" style={{ background: `var(--${background})`, ...(background === 'card' ? { '--background': 'var(--card)' } : {}) }}>
    <ReportProvider value={reportMock.context}>
      <Tabs value={section} variant="underline" className="mv-report-nav"><TabsList>{sections.map(item => <TabsTrigger key={item.id} value={item.id}>{item.label}</TabsTrigger>)}</TabsList></Tabs>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={section} initial={{ opacity: 0, transform: 'translateY(12px)' }} animate={{ opacity: 1, transform: 'translateY(0px)' }} exit={{ opacity: 0, transform: 'translateY(-8px)' }} transition={{ duration: reduced ? 0 : 0.24, ease: [0.22, 1, 0.36, 1] }}>
          <ReportPreviewContent section={section} />
        </motion.div>
      </AnimatePresence>
    </ReportProvider>
  </div>
}
export function ReportShowcase() {
  const [visual] = useReportVisualSettings()
  const [fade] = useAssetFade()
  const assetRef = useRef(null)
  const frameRef = useRef(null)
  const [scale, setScale] = useState(0.5)
  const [section, setSection] = useState('overview')
  const syncTheme = () => {
    const dark = assetRef.current?.closest('.mv-website')?.classList.contains('dark')
    frameRef.current?.contentDocument?.documentElement.classList.toggle('dark', Boolean(dark))
  }
  const sendSection = () => frameRef.current?.contentWindow?.postMessage({ type: 'moonvine:report-preview', section, background: visual.assetBackground }, window.location.origin)
  useEffect(sendSection, [section, visual.assetBackground])
  useEffect(() => {
    const page = assetRef.current?.closest('.mv-website')
    page?.style.setProperty('--mv-page-background', `var(--${visual.pageBackground})`)
    return () => page?.style.removeProperty('--mv-page-background')
  }, [visual.pageBackground])
  useEffect(() => {
    const asset = assetRef.current
    const resize = new ResizeObserver(([entry]) => setScale(entry.contentRect.width / REPORT_VIEWPORT_WIDTH))
    resize.observe(asset)
    const theme = new MutationObserver(syncTheme)
    theme.observe(asset.closest('.mv-website'), { attributes: true, attributeFilter: ['class'] })
    return () => { resize.disconnect(); theme.disconnect() }
  }, [REPORT_VIEWPORT_WIDTH])
  return <WebsiteSection id="reports" className="mv-report-band" labelledBy="reports-title">
    <div className="mv-report-layout">
      <div className="mv-report-visual" data-reveal-item style={{ width: `${visual.size}%`, '--report-background': `var(--${visual.assetBackground})`, '--report-fade-right': `${visual.fadeRight}%`, '--report-fade-bottom': `${visual.fadeBottom}%` }}>
        <div className="mv-report-asset-shadow">
        <div ref={assetRef} id="report-section-preview" className="mv-report-asset mv-asset-fade" style={assetFadeStyle(fade)} data-report-signal-target aria-label="Weekly report preview">
          <iframe ref={frameRef} src="/website/report-preview" title="Weekly report desktop preview" className="mv-report-frame" width={REPORT_VIEWPORT_WIDTH} height="800" tabIndex={-1} inert scrolling="no" onLoad={() => { syncTheme(); sendSection() }} style={{ transform: `scale(${scale})` }} />
        </div>
        </div>
        <FrameCard className="mv-report-notification" withFill>
          <FrameCardContent>
            <p className="mv-report-notification-title"><ReportStatusDot unread />New report available!</p>
            <p className="mv-report-notification-date"><CalendarBlank size={16} aria-hidden="true" />Aug 25 – Aug 31</p>
          </FrameCardContent>
        </FrameCard>
      </div>
      <div className="mv-report-copy">
        <h2 id="reports-title" className="mv-report-heading">A marketing and competitor audit every Monday.</h2>
        <div className="mv-report-section-nav" role="group" aria-label="Preview report sections">
          {sections.map(item => <Button key={item.id} variant={section === item.id ? 'default' : 'ghost'} aria-pressed={section === item.id} aria-controls="report-section-preview" onClick={() => setSection(item.id)}>{item.label}</Button>)}
        </div>
        <span className="sr-only" role="status">Showing {sections.find(item => item.id === section).label} report preview</span>
      </div>
    </div>
  </WebsiteSection>
}
