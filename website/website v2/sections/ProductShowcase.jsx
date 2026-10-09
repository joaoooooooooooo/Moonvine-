import { useAssetFade, assetFadeStyle, fadeDefaults } from '../components/asset-fade'
import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, useInView, useReducedMotion } from 'motion/react'
import { Button } from '../../../src/components/ui/button'
import { ScrollArea } from '../../../src/components/ui/scroll-area'
import { MoviShowcase } from '../../../src/features/movi-showcase/MoviShowcase'
import { MetricLineChart } from '../../../src/features/observatory/_V2/components/search-clicks-chart'
import { VisitorSourcesChart } from '../../../src/features/observatory/_V2/components/analytics/visitor-sources-chart'
import { searchClicksSeries } from '../../../src/features/observatory/_V2/utils/search-clicks-series'
import { engagementSeries } from '../../../src/features/observatory/_V2/utils/engagement-series'
import { lensIcons } from '../../../src/features/observatory/_V2/data/navigation'
import { Activity } from '../../../src/components/ui/icons'
import '../../../src/features/observatory/_V2/components/signals-grid.css'
import { accounts } from '../../../src/features/observatory/_V2/data/observatory-fixtures'
import { buildLenses } from '../../../src/features/observatory/_V2/utils/observatory-model'
import { WebsiteSection } from '../components/website-primitives'
import './product-showcase.css'

const account = accounts.find(item => item.id === 'canopy')
const lenses = buildLenses(account)
const analytics = lenses.find(item => item.id === 'analytics')
const visits = searchClicksSeries(analytics)
const engagement = engagementSeries(visits)
const metricLenses = ['news', 'search', 'analytics'].map(id => lenses.find(item => item.id === id))

function FadeSlider({ label, value, onChange, min = 0, max = 100, step = 1, unit = '%' }) {
  return <label className="og-control"><span>{label}<output>{value}{unit}</output></span><input type="range" min={min} max={max} step={step} value={value} onChange={event => onChange(Number(event.target.value))} /></label>
}

export function ProductShowcase() {
  const reducedMotion = useReducedMotion()
  const [firstQuestionSent, setFirstQuestionSent] = useState(false)
  const handleFirstQuestionSent = useCallback(() => setFirstQuestionSent(true), [])
  const chartsRef = useRef(null)
  const chartsInView = useInView(chartsRef, { once: true, amount: 0.15 })
  const [fade, setFade] = useAssetFade()
  const [controlsOpen, setControlsOpen] = useState(false)
  const [portal, setPortal] = useState(null)
  useEffect(() => { setPortal(document.querySelector('.mv-website')) }, [])
  const update = (key, value) => setFade(current => ({ ...current, [key]: value }))

  return <WebsiteSection className="mv-delivery-band mv-product-band" labelledBy="delivery-title">
    <div className="mv-product-layout">
      <h2 id="delivery-title" className="mv-product-heading">Access your data in plain language, in one place. Work with it in chat.</h2>
      <div className="mv-product-stage" data-reveal-skip>
        <div className="mv-product-intelligence mv-asset-fade" aria-hidden="true" inert style={assetFadeStyle(fade)}>
          <div ref={chartsRef} className="mv-product-charts v2-signals-grid">
            {chartsInView && <>
            {metricLenses.map(lens => <MetricLineChart dataReady={firstQuestionSent} key={lens.id} compact className="min-w-0" title={lens.id === 'analytics' ? 'Visits' : lens.metric} metricLabel={lens.id === 'analytics' ? 'Website visits' : lens.metric} icon={lensIcons[lens.id]} data={lens.id === 'analytics' ? visits : searchClicksSeries(lens)} />)}
            <MetricLineChart dataReady={firstQuestionSent} compact className="min-w-0" title="Engagement rate" metricLabel="Engagement rate" icon={Activity} data={engagement.data} metricValue={engagement.value} comparisonLabel={engagement.change} percentage curveType="bump" color="var(--chart-2)" />
            <div className="mv-product-visitor-sources v2-signals-grid"><VisitorSourcesChart dataReady={firstQuestionSent} lens={analytics} /></div>
            </>}
          </div>
        </div>
        <motion.div className="mv-product-chat" initial={reducedMotion ? false : { opacity: 0, transform: 'translateY(16px)' }} whileInView={{ opacity: 1, transform: 'translateY(0px)' }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: reducedMotion ? 0 : 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}>
          <MoviShowcase loop={false} autoAdvance={false} onFirstQuestionSent={handleFirstQuestionSent} />
        </motion.div>
      </div>
    </div>
    {portal && createPortal(<div className="mv-fade-debug">
      {controlsOpen ? <aside className="og-panel" aria-label="Chart fade controls">
        <ScrollArea className="mv-fade-debug-scroll" overscrollContain>
          <div className="mv-fade-debug-content">
            <div className="og-panel-heading"><h2>Chart fade</h2><Button variant="ghost" size="sm" onClick={() => setControlsOpen(false)}>Close</Button></div>
            <label className="og-control">Mode<select value={fade.mode} onChange={e => update('mode', e.target.value)}><option value="mask">Mask</option><option value="overlay">Background overlay</option><option value="none">No fade</option></select></label>
            <label className="og-control">Direction<select value={fade.direction} onChange={e => update('direction', e.target.value)}><option value="edges">Bottom + right edges</option><option value="diagonal">Diagonal</option></select></label>
            {fade.direction === 'edges' ? <>
              <FadeSlider label="Right fade length" value={fade.right} onChange={v => update('right', v)} />
              <FadeSlider label="Bottom fade length" value={fade.bottom} onChange={v => update('bottom', v)} />
            </> : <>
              <FadeSlider label="Fade starts at" value={fade.start} max={99} onChange={v => update('start', v)} />
              <FadeSlider label="Angle" value={fade.angle} max={360} unit="deg" onChange={v => update('angle', v)} />
            </>}
            <FadeSlider label="Grain opacity" value={fade.grain} max={10} step={0.1} onChange={v => update('grain', v)} />
            <Button variant="outline" onClick={() => setFade(fadeDefaults)}>Reset fade</Button>
          </div>
        </ScrollArea>
      </aside> : <Button variant="outline" onClick={() => setControlsOpen(true)}>Chart fade</Button>}
    </div>, portal)}
  </WebsiteSection>
}
