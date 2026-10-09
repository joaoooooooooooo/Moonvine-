import { useAssetFade, fadeDefaults } from '../components/asset-fade'
﻿import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Button } from '../../../src/components/ui/button'
import { ScrollArea } from '../../../src/components/ui/scroll-area'

export const reportVisualDefaults = { pageBackground: 'background', assetBackground: 'background', fadeRight: 32, fadeBottom: 57, size: 100, assetBlur: 0, assetY: -13, assetOpacity: 100, cardBlur: 58, cardSpread: 0, cardY: -40, cardOpacity: 8 }
const storageKey = 'moonvine:website:report-visual:v2'
export function useReportVisualSettings() {
  const [settings, setSettings] = useState(() => {
    try { return { ...reportVisualDefaults, ...JSON.parse(localStorage.getItem(storageKey) || '{}') } } catch { return reportVisualDefaults }
  })
  useEffect(() => { try { localStorage.setItem(storageKey, JSON.stringify(settings)) } catch {} }, [settings])
  return [settings, setSettings]
}
function Slider({ label, setting, value, onChange, min = 0, max = 120, step = 1, unit = 'px' }) {
  return <label className="og-control"><span>{label}<output>{value[setting]}{unit}</output></span><input type="range" min={min} max={max} step={step} value={value[setting]} onChange={event => onChange(current => ({ ...current, [setting]: Number(event.target.value) }))} /></label>
}
export function ReportShowcaseControls({ value, onChange }) {
  const [fade, setFade] = useAssetFade()
  const [open, setOpen] = useState(false)
  const [copyStatus, setCopyStatus] = useState('')
  const [portal, setPortal] = useState(null)
  useEffect(() => setPortal(document.querySelector('.mv-website')), [])
  async function copyAllProperties() {
    try {
      await navigator.clipboard.writeText(JSON.stringify({ report: value, fade }, null, 2))
      setCopyStatus('All properties copied')
    } catch {
      setCopyStatus('Could not copy properties')
    }
  }
  if (!portal) return null
  return createPortal(<div className="mv-report-debug">{open ? <aside className="og-panel" aria-label="Report asset controls">
    <ScrollArea className="mv-report-debug-scroll" overscrollContain>
      <div className="mv-report-debug-content">
        <div className="og-panel-heading"><h2>Report asset</h2><Button variant="ghost" size="sm" onClick={() => setOpen(false)}>Close</Button></div>
        <label className="og-control"><span>Page background</span><select value={value.pageBackground} onChange={event => onChange(current => ({ ...current, pageBackground: event.target.value }))}><option value="background">Background</option><option value="card">Card</option></select></label>
        <label className="og-control"><span>Report background</span><select value={value.assetBackground} onChange={event => onChange(current => ({ ...current, assetBackground: event.target.value }))}><option value="card">Card</option><option value="background">Background</option></select></label>
        <details open><summary>Fade</summary>
          <label className="og-control"><span>Mode</span><select value={fade.mode} onChange={event => setFade(current => ({ ...current, mode: event.target.value }))}><option value="mask">Mask</option><option value="overlay">Background overlay</option><option value="none">No fade</option></select></label>
          <label className="og-control"><span>Direction</span><select value={fade.direction} onChange={event => setFade(current => ({ ...current, direction: event.target.value }))}><option value="edges">Bottom + right edges</option><option value="diagonal">Diagonal</option></select></label>
          {fade.direction === 'edges' ? <>
            <Slider label="Right fade length" setting="right" value={fade} onChange={setFade} max={100} unit="%" />
            <Slider label="Bottom fade length" setting="bottom" value={fade} onChange={setFade} max={100} unit="%" />
          </> : <>
            <Slider label="Fade starts at" setting="start" value={fade} onChange={setFade} max={99} unit="%" />
            <Slider label="Angle" setting="angle" value={fade} onChange={setFade} max={360} unit="deg" />
          </>}
          <Slider label="Grain opacity" setting="grain" value={fade} onChange={setFade} max={10} step={0.1} unit="%" />
          <Button variant="outline" onClick={() => setFade(fadeDefaults)}>Reset fade</Button>
        </details>
        <Slider label="Asset size" setting="size" value={value} onChange={onChange} min={60} max={150} unit="%" />

        <Button variant="outline" onClick={() => onChange(reportVisualDefaults)}>Reset report appearance</Button>
        <Button variant="outline" onClick={copyAllProperties}>Copy all properties</Button>
        {copyStatus && <p className="og-note" role="status">{copyStatus}</p>}
      </div>
    </ScrollArea>
  </aside> : <Button variant="outline" onClick={() => setOpen(true)}>Report controls</Button>}</div>, portal)
}
