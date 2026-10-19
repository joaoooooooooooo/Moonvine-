import { useAssetFade, assetFadeStyle, fadeDefaults } from '../../components'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useInView } from 'motion/react'
import { Button } from '../../../../src/components/ui/button'
import { FrameCard, FrameCardContent } from '../../../../src/components/ui/frame-card'
import { ScrollArea } from '../../../../src/components/ui/scroll-area'
import { MoviShowcase } from '../../../../src/features/movi-showcase/MoviShowcase'
import { MetricLineChart } from '../../../../src/features/observatory/observatory/components/search-clicks-chart'
import { VisitorSourcesChart } from '../../../../src/features/observatory/observatory/components/analytics/visitor-sources-chart'
import { searchClicksSeries } from '../../../../src/features/observatory/observatory/utils/search-clicks-series'
import { engagementSeries } from '../../../../src/features/observatory/observatory/utils/engagement-series'
import { lensIcons } from '../../../../src/features/observatory/observatory/data/navigation'
import { Activity } from '../../../../src/components/ui/icons'
import '../../../../src/features/observatory/observatory/components/signals-grid.css'
import { accounts } from '../../../../src/features/observatory/observatory/data/observatory-fixtures'
import { buildLenses } from '../../../../src/features/observatory/observatory/utils/observatory-model'
import { WebsiteSection, StaggeredHeading } from '../../components'
import './product-showcase.css'

const account = accounts.find(item => item.id === 'canopy')
const lenses = buildLenses(account)
const analytics = lenses.find(item => item.id === 'analytics')
const visits = searchClicksSeries(analytics)
const engagement = engagementSeries(visits)
const metricLenses = ['news', 'search', 'analytics'].map(id => lenses.find(item => item.id === id))
const SHOW_DEBUG_CONTROLS = false
const chartRightFade = 'linear-gradient(to right, #000 0%, #000 80%, transparent 100%)'

function FadeSlider({ label, value, onChange, min = 0, max = 100, step = 1, unit = '%' }) {
  return <label className="og-control"><span>{label}<output>{value}{unit}</output></span><input type="range" min={min} max={max} step={step} value={value} onChange={event => onChange(Number(event.target.value))} /></label>
}

export function ProductShowcase() {
  const chartsRef = useRef(null)
  const chartsReady = useInView(chartsRef, { once: true, amount: 0.1 })
  const [fade, setFade] = useAssetFade()
  const [controlsOpen, setControlsOpen] = useState(false)
  const [copyStatus, setCopyStatus] = useState('')
  const [portal, setPortal] = useState(null)
  useEffect(() => { setPortal(document.querySelector('.mv-website')) }, [])
  const update = (key, value) => setFade(current => ({ ...current, [key]: value }))
  async function copyFadeProperties() {
    try {
      await navigator.clipboard.writeText(JSON.stringify(fade, null, 2))
      setCopyStatus('Fade properties copied')
    } catch {
      setCopyStatus('Could not copy fade properties')
    }
  }

  return <WebsiteSection className="mv-delivery-band mv-product-band mv-theme-dark" labelledBy="delivery-title">
    <div className="mv-product-layout">
      <div className="mv-product-copy">
        <StaggeredHeading id="delivery-title" className="mv-product-heading">Access your data in plain language, in one place. Work with it in chat.</StaggeredHeading>
        <p className="mv-product-description">AIO/GEO, social and competitor intel, earned media, and more via chat.</p>
      </div>
      <div className="mv-product-stage">
        <div className="mv-product-intelligence-shadow">
          <FrameCard withFill className="mv-product-intelligence mv-asset-fade" data-reveal-item style={{ ...assetFadeStyle(fade), maskImage: chartRightFade, WebkitMaskImage: chartRightFade, '--shell-overlay': 'none' }}>
          <FrameCardContent className="mv-product-intelligence-frame">
            <div ref={chartsRef} className="mv-product-charts v2-signals-grid">
              {chartsReady && <>
                {metricLenses.map(lens => <MetricLineChart dataReady={chartsReady} key={lens.id} compact className="min-w-0" title={lens.id === 'analytics' ? 'Visits' : lens.metric} metricLabel={lens.id === 'analytics' ? 'Website visits' : lens.metric} icon={lensIcons[lens.id]} data={lens.id === 'analytics' ? visits : searchClicksSeries(lens)} />)}
                <MetricLineChart dataReady={chartsReady} compact className="min-w-0" title="Engagement rate" metricLabel="Engagement rate" icon={Activity} data={engagement.data} metricValue={engagement.value} comparisonLabel={engagement.change} percentage curveType="bump" color="var(--chart-2)" />
                <div className="mv-product-visitor-sources v2-signals-grid"><VisitorSourcesChart dataReady={chartsReady} lens={analytics} /></div>
              </>}
            </div>
          </FrameCardContent>
          </FrameCard>
        </div>
        <FrameCard withFill className="mv-product-chat" data-reveal-item>
          <FrameCardContent className="mv-product-chat-frame">
            <MoviShowcase loop={false} autoAdvance={false} singleTurn />
          </FrameCardContent>
        </FrameCard>
      </div>
    </div>
    {SHOW_DEBUG_CONTROLS && portal && createPortal(<div className="mv-fade-debug">
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
            <Button variant="outline" onClick={copyFadeProperties}>Copy all properties</Button>
            {copyStatus && <p className="og-note" role="status">{copyStatus}</p>}
          </div>
        </ScrollArea>
      </aside> : <Button variant="outline" onClick={() => setControlsOpen(true)}>Chart fade</Button>}
    </div>, portal)}
  </WebsiteSection>
}
