import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight } from '@phosphor-icons/react'
import { animate, motion, useInView, useMotionValue, useReducedMotion } from 'motion/react'
import { FrameCard, FrameCardContent } from '../../../src/components/ui/frame-card'
import { Card, CardContent, CardHeader, CardTitle } from '../../../src/components/ui/card'
import { ChatComposer } from '../../../src/features/observatory/_V2/components/intelligence-chat/chat-composer'
import { Message, MessageContent } from '../../../src/components/agents/message'
import StreamingText from '../../../src/features/movi-showcase/StreamingText'
import { accountHref } from '../../../src/features/observatory/_V2/utils/observatory-model'
import { intelligenceItems } from '../../../src/features/observatory/_V2/data/intelligence-navigation'
import '../../../src/features/movi-showcase/movi-showcase.css'
import { ReportsMultiSeriesLineChart } from '../../../src/features/Reports/components/line/line'
import { SiteStatCard } from '../../../src/features/Reports/components/siteStatCard/components/site-stat-card'
import { ObservatoryTable } from '../../../src/features/observatory/_V2/components/observatory-table'
import { PageFixRow } from '../../../src/features/observatory/_V2/components/site-health/page-fix-row'
import { getSiteFixes } from '../../../src/features/observatory/_V2/data/site-fixes'
import { TableBody } from '../../../src/components/ui/table'
import { RankedMetricRow } from '../../../src/features/observatory/_V2/components/ranked-metric-row'
import { ProviderLogo } from '../../../src/features/observatory/_V2/components/ai-visibility/provider-logo'
import { TableProfileAvatar } from '../../../src/features/observatory/_V2/components/table-profile-avatar'
import { WebsiteSection, SectionIntro } from '../components/website-primitives'
import './inside.css'

const features = [
  {
    title: "This week's headlines",
    description: 'The three or four things that actually moved, and the one you want to act on first — in plain language, not dashboard speak.',
  },
  {
    title: 'Key metrics',
    description: 'Sessions, engaged sessions, new users, and engagement rate at a glance, with trends you can read instantly.',
  },
  {
    title: 'Competitor tracking',
    description: 'See where rivals posted, what changed on their sites, and which moves are drawing attention.',
  },
  {
    title: 'Social monitoring',
    description: 'Follow your posts and competitor momentum across the channels that matter to your audience.',
  },
  {
    title: 'Website health',
    description: 'Understand the performance, accessibility, and indexing issues shaping your site’s reach.',
  },
  {
    title: 'AIO + SEO findability',
    description: 'See how you appear in search results and in the AI answers people use to discover brands.',
  },
  {
    title: 'Cross-intelligence signals',
    description: 'Spot relationships across sources and the patterns that take shape over time.',
  },
  {
    title: 'Technical appendix + export',
    description: 'Take the supporting numbers and prioritized fixes to your team or your records.',
  },
]

const crossIntelligenceAnswer = [
  { text: 'Search' }, { text: 'clicks' }, { text: 'rose' }, { text: '6.8%', sentiment: 'success' }, { text: 'this' }, { text: 'week.' },
  { text: '', cite: true, sourceIndex: 0 },
  { text: 'Social' }, { text: 'engagement' }, { text: 'fell' }, { text: '12.4%.', sentiment: 'error' },
  { text: '', cite: true, sourceIndex: 1 },
  { text: 'Share' }, { text: 'the' }, { text: 'new' }, { text: 'pages' }, { text: 'in' }, { text: 'upcoming' }, { text: 'posts.' },
]
const crossIntelligenceSources = ['source:gsc', 'source:social'].map(lens => {
  const source = intelligenceItems.find(item => item.lens === lens)
  return { name: source.label, domain: lens, href: '/observatory-v2' + accountHref('northstar', lens), icon: source.icon, image: '' }
})

function FeatureAsset({ index }) {
  if (index === 1) {
    return <div className="mv-feature-chart"><ReportsMultiSeriesLineChart /></div>
  }

  if (index === 3) {
    return <div className="mv-feature-social">
      <div className="mv-feature-social-donut" />
      <div className="mv-feature-social-key"><i /><i /><i /><i /></div>
    </div>
  }

  if (index === 6) {
    return <div className="mv-feature-chat movi-showcase">
      <div className="movi-thread">
        <Message from="assistant"><MessageContent className="w-full"><StreamingText content={crossIntelligenceAnswer} sources={crossIntelligenceSources} visibleCount={crossIntelligenceAnswer.length} playing={false} loop={false} fill showExtras={false} /></MessageContent></Message>
      </div>
      <ChatComposer embedded readOnly value="" onChange={() => {}} onSend={() => {}} isReplying />
    </div>
  }

  if (index === 0) {
    return <Card className="mv-feature-brief">
      <CardHeader><CardTitle>Weekly highlights</CardTitle></CardHeader>
      <CardContent>
      <p><span className="mv-feature-spark">✦</span> Search interest rose as new pages were published.</p>
      <p><span className="mv-feature-spark">✦</span> Your audience stayed longer this week.</p>
      <p><span className="mv-feature-spark">✦</span> One competitor gained momentum in social.</p>
      </CardContent>
    </Card>
  }

  if (index === 2) {
    return <ol className="mv-feature-ranked" aria-label="Competitor activity">
      <RankedMetricRow label="Studio Field" leading={<TableProfileAvatar src="/entity-profiles/studio-field.svg" />} value={32} share={82} unit="posts" shareLabel="Share of tracked activity" />
      <RankedMetricRow label="Common Ground" leading={<TableProfileAvatar src="/entity-profiles/common-ground.svg" />} value={14} share={58} unit="posts" shareLabel="Share of tracked activity" />
      <RankedMetricRow label="Form & Matter" leading={<TableProfileAvatar src="/entity-profiles/form-matter.svg" />} value={6} share={32} unit="posts" shareLabel="Share of tracked activity" />
      <RankedMetricRow label="Northstar Studio" leading={<TableProfileAvatar src="/entity-profiles/northstar.svg" />} value={5} share={24} unit="posts" shareLabel="Share of tracked activity" />
      <RankedMetricRow label="Meridian Group" leading={<TableProfileAvatar src="/entity-profiles/meridian.svg" />} value={3} share={16} unit="posts" shareLabel="Share of tracked activity" />
    </ol>
  }

  if (index === 4) {
    return <div className="mv-feature-performance"><SiteStatCard title="Website performance" score={73} /></div>
  }

  if (index === 5) {
    return <div className="mv-feature-ai">
      <ol className="mv-feature-ranked" aria-label="AI answer sources">
        <RankedMetricRow label="ChatGPT" leading={<ProviderLogo name="ChatGPT" />} value={21} share={33} unit="answers" shareLabel="Share of answers" />
        <RankedMetricRow label="Gemini" leading={<ProviderLogo name="Gemini" />} value={17} share={27} unit="answers" shareLabel="Share of answers" />
        <RankedMetricRow label="Perplexity" leading={<ProviderLogo name="Perplexity" />} value={12} share={19} unit="answers" shareLabel="Share of answers" />
        <RankedMetricRow label="Claude" leading={<ProviderLogo name="Claude" />} value={9} share={14} unit="answers" shareLabel="Share of answers" />
        <RankedMetricRow label="Copilot" leading={<ProviderLogo name="Copilot" />} value={5} share={8} unit="answers" shareLabel="Share of answers" />
      </ol>
    </div>
  }

  return <div className="mv-feature-action"><ObservatoryTable label="Pages to review">
    <TableBody>{getSiteFixes('canopy.example').slice(3, 10).map(page => <PageFixRow key={page.path} page={page} showWarnings={false} issueVariant="warning" />)}</TableBody>
  </ObservatoryTable></div>
}

function FeatureCard({ feature, index }) {
  const cardRef = useRef(null)
  const inView = useInView(cardRef, { amount: 0.35 })
  return <FrameCard ref={cardRef} withFill className={`mv-feature-card${inView ? ' is-in-view' : ''}`} role="group" aria-label={`${index + 1} of ${features.length}: ${feature.title}`}>
    <FrameCardContent className="mv-feature-card-content">
      <div className="mv-feature-copy"><h3>{feature.title}</h3><p>{feature.description}</p></div>
      <div className="mv-feature-asset" aria-hidden="true">{index === 7
        ? <FeatureAsset index={index} />
        : <div className="mv-feature-asset-frame"><FeatureAsset index={index} /></div>}
      </div>
    </FrameCardContent>
  </FrameCard>
}

export function Inside() {
  const viewportRef = useRef(null)
  const trackRef = useRef(null)
  const firstCardRef = useRef(null)
  const x = useMotionValue(0)
  const reducedMotion = useReducedMotion()
  const [index, setIndex] = useState(0)
  const [layout, setLayout] = useState({ step: 1, maxOffset: 0, maxIndex: 0 })

  useLayoutEffect(() => {
    const viewport = viewportRef.current
    const track = trackRef.current
    const card = firstCardRef.current
    if (!viewport || !track || !card) return
    const measure = () => {
      const gap = parseFloat(getComputedStyle(track).columnGap) || 0
      const overlap = parseFloat(getComputedStyle(card).marginRight) || 0
      const step = card.getBoundingClientRect().width + gap + overlap
      const maxOffset = Math.max(0, track.scrollWidth - viewport.clientWidth)
      setLayout({ step, maxOffset, maxIndex: Math.ceil(maxOffset / step) })
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(viewport)
    observer.observe(card)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const target = -Math.min(index * layout.step, layout.maxOffset)
    const controls = animate(x, target, reducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 260, damping: 34, mass: 0.85 })
    return () => controls.stop()
  }, [index, layout, reducedMotion, x])

  const goTo = next => setIndex(Math.max(0, Math.min(layout.maxIndex, next)))
  const onDragEnd = (_, info) => {
    const projected = Math.min(layout.maxOffset, Math.max(0, -x.get() - info.velocity.x * 0.16))
    let next = 0
    let nearest = Infinity
    for (let page = 0; page <= layout.maxIndex; page++) {
      const distance = Math.abs(Math.min(page * layout.step, layout.maxOffset) - projected)
      if (distance < nearest) { nearest = distance; next = page }
    }
    goTo(next)
    if (next === index) {
      animate(x, -Math.min(next * layout.step, layout.maxOffset), reducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 260, damping: 34, mass: 0.85 })
    }
  }

  return <WebsiteSection id="inside" className="mv-inside-band mv-theme-dark" labelledBy="inside-title">
    <SectionIntro id="inside-title" title={<>Every signal, read every week. <span>Made to make sense, with a clear place to put your effort.</span></>} aside={
      <nav className="mv-feature-nav" aria-label="Feature carousel">
        <button type="button" aria-label="Previous features" disabled={index === 0} onClick={() => goTo(index - 1)}><ArrowLeft size={20} /></button>
        <button type="button" aria-label="Next features" disabled={index >= layout.maxIndex} onClick={() => goTo(index + 1)}><ArrowRight size={20} /></button>
      </nav>
    } />
    <div ref={viewportRef} className="mv-feature-viewport" role="region" aria-roledescription="carousel" aria-label="Weekly report features">
      <motion.div
        ref={trackRef}
        className="mv-feature-track"
        style={{ x }}
        drag={layout.maxOffset > 0 ? 'x' : false}
        dragConstraints={{ left: -layout.maxOffset, right: 0 }}
        dragElastic={0.06}
        dragMomentum={false}
        onDragEnd={onDragEnd}
      >
        {features.map((feature, featureIndex) =>
          <div ref={featureIndex === 0 ? firstCardRef : undefined} className="mv-feature-slide" key={feature.title}>
            <FeatureCard feature={feature} index={featureIndex} />
          </div>
        )}
      </motion.div>
    </div>
  </WebsiteSection>
}
