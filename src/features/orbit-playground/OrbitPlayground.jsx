import { PageSignalOutlet } from './PageSignalOutlet'
import React, { useEffect, useId, useMemo, useRef, useState } from 'react'
import { animate, motion, motionValue, useAnimationFrame, useInView, useMotionValue, useReducedMotion, useTransform } from 'motion/react'
import { Button } from '../../components/ui/button'
import { ScrollArea } from '../../components/ui/scroll-area'
import { projectRing } from './project-ring'
import { defaultInteraction, stepRingDynamics } from './ring-dynamics'
import { readSetting, saveSetting, useSavedSetting } from './use-saved-setting'
import { signalTravel } from './signal-transition'
import './orbit-playground.css'

const initialRings = [
  { tilt: 0, angle: 0, speed: 4, size: 100, visible: true },
  { tilt: 66, angle: 28, speed: 9, size: 100, visible: true },
  { tilt: 66, angle: -38, speed: -7, size: 100, visible: true },
  { tilt: 78, angle: 0, speed: 5, size: 64, visible: true },
]
const solarRings = [
  { tilt: 52, angle: -18, speed: 14, size: 28, visible: true, dashed: false },
  { tilt: 52, angle: -18, speed: 9, size: 51, visible: true, dashed: false },
  { tilt: 52, angle: -18, speed: 6, size: 75, visible: true, dashed: false },
  { tilt: 52, angle: -18, speed: 4, size: 100, visible: true, dashed: true },
]

const defaultConnectors = { enabled: true, thickness: 0.5, opacity: 0.45, dashed: true }
const logos = [
  { name: 'AIO / GEO', src: '/provider-logos/openai.svg' },
  { name: 'Search insights', src: '/orbit-logos/googletrends.png' },
  { name: 'SEO / SEM', src: '/orbit-logos/google.svg' },
  { name: 'Competitors', src: '/orbit-logos/semrush.svg' },
  { name: 'Earned media', src: '/orbit-logos/googlenews.svg' },
  { name: 'Traffic', src: '/orbit-logos/googleanalytics.svg' },
  { name: 'Site health', src: '/orbit-logos/pagespeedinsights.svg' },
  { name: 'YouTube', src: '/orbit-logos/youtube.svg' },
  { name: 'TikTok', src: '/report-logos/tiktok.svg' },
  { name: 'LinkedIn', src: '/orbit-logos/linkedin.svg' },
  { name: 'Instagram', src: '/orbit-logos/instagram.svg' },
  { name: 'Perplexity', src: '/provider-logos/perplexity.svg' },
  { name: 'X', src: '/report-logos/x.svg' },
]
const defaultAppearance = { logoSize: 0.75, logos: true, names: true, fade: true, fadeSize: 2, fadeOpacity: 0.75, fadeSoftness: 20 }
// Shared by forward and reverse transitions; editable in the Motion panel.
const ringTransition = { duration: 2, ease: [0.113, 0.517, 0.567, 0.832] }
const lineTransition = { duration: 0.9, ease: [0.22, 1, 0.36, 1] }
const logoTransition = { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
const outletTransition = { duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }
const ringStagger = 0.16
const lineStagger = 0.12
const defaultHitbox = { width: 72, outerWidth: 104, visible: false, followWobble: true, releaseDelay: 120 }
const defaultFog = { enabled: true, strength: 0.85, start: 80, reach: 70 }
const defaultSignals = { enabled: true, count: 9, duration: 4.5, outward: false, size: 1.25, color: '#a9ff9e', themeColor: false }
const SHOW_DEBUG_CONTROLS = false

function OrbitBody({ ring, wobble, flatten, lineAlignment, logoProgress, dotAlignment, index, phase, logo, clock, viewX, viewY, solar, bodies, connectors, appearance, signals, signalClock, fadeId }) {
  const logoMaskId = useId()
  const x = useTransform(() => projectRing(ring.size, ring.tilt, ring.angle + (solar ? 0 : clock.get() * ring.speed), (viewX.get() + wobble.x.get()), (viewY.get() + wobble.y.get()), phase + clock.get() * ring.speed, 'x', flatten.get()))
  const y = useTransform(() => projectRing(ring.size, ring.tilt, ring.angle + (solar ? 0 : clock.get() * ring.speed), (viewX.get() + wobble.x.get()), (viewY.get() + wobble.y.get()), phase + clock.get() * ring.speed, 'y', flatten.get()))
  // Retract the outer endpoint along the radial path toward the center.
  const lineX = useTransform(() => x.get() * (1 - lineAlignment.get()))
  const lineY = useTransform(() => y.get() * (1 - lineAlignment.get()))
  // Share a limited stream across all connections instead of emitting on every
  // line simultaneously. Each new signal advances to the next logo.
  const progress = useTransform(() => {
    if (signals.count === 0) return 1
    const emission = signalClock.get() / signals.duration * signals.count
    // A fresh stream starts empty; don't wrap un-emitted dots into old positions.
    if (emission < index) return 1
    const age = (emission - index) % logos.length
    return Math.min(1, age / signals.count)
  })
  const travel = useTransform(() => signalTravel(progress.get()))
  // Freeze the stream clock during collection, then bring its visible dots home.
  const signalDistance = useTransform(() => (signals.outward ? travel.get() : 1 - travel.get()) * (1 - dotAlignment.get()))
  const signalX = useTransform(() => x.get() * signalDistance.get())
  const signalY = useTransform(() => y.get() * signalDistance.get())
  const signalVisibility = useTransform(() => progress.get() < 1 && dotAlignment.get() < 1 ? 'visible' : 'hidden')
  const logoSize = 2.8 * appearance.logoSize
  const fadeRadius = logoSize * appearance.fadeSize
  const labelSize = 2.1 * appearance.logoSize
  const position = useTransform(() => `translate(${x.get()}px, ${y.get()}px)`)
  const logoScale = useTransform(() => `scale(${logoProgress.get()})`)

  return <g visibility={ring.visible ? 'visible' : 'hidden'} pointerEvents="none">
    {connectors.enabled && ring.connector !== false && <motion.line x1={0} y1={0} x2={lineX} y2={lineY} stroke="var(--color-neutral-400)" strokeWidth={connectors.thickness} strokeDasharray={connectors.dashed ? '2 5' : undefined} vectorEffect="non-scaling-stroke" opacity={connectors.opacity} />}
    {connectors.enabled && ring.connector !== false && signals.enabled && <motion.circle cx={signalX} cy={signalY} r={0.32 * signals.size} visibility={signalVisibility} fill={signals.themeColor !== false ? 'var(--foreground)' : signals.color} />}
    {bodies && appearance.logos && <motion.g className="og-orbit-brand" style={{ transform: position }}>
      <motion.g style={{ transform: logoScale, transformOrigin: '0px 0px', opacity: logoProgress }}>
        {appearance.fade && <circle cx={0} cy={0} r={fadeRadius} fill={`url(#${fadeId})`} />}
        <defs><mask id={logoMaskId} maskUnits="userSpaceOnUse" x={-logoSize / 2} y={-logoSize / 2} width={logoSize} height={logoSize} style={{ maskType: 'alpha' }}>
          <image href={logo.src} x={-logoSize / 2} y={-logoSize / 2} width={logoSize} height={logoSize} draggable={false} />
        </mask></defs>
        <rect x={-logoSize / 2} y={-logoSize / 2} width={logoSize} height={logoSize} fill="var(--foreground)" mask={`url(#${logoMaskId})`} />
        {appearance.names && <text x={logoSize / 2 + 0.8} y={0.1} dominantBaseline="middle" fill="var(--foreground)" fontSize={labelSize} fontFamily="var(--font-sans)">{logo.name}</text>}
      </motion.g>
    </motion.g>}
  </g>
}

function OutletDot({ index, length, transition, signals }) {
  const progress = useTransform(() => {
    const age = transition.outbound.get() / signals.duration - index / Math.max(1, signals.count)
    return age < 0 ? 0 : age % 1
  })
  const y = useTransform(() => length * transition.lines.get() * signalTravel(progress.get()))
  const visibility = useTransform(() => transition.lines.get() > 0 && transition.outbound.get() / signals.duration >= index / Math.max(1, signals.count) ? 'visible' : 'hidden')
  return <motion.circle cx={0} cy={y} r={0.32 * signals.size} visibility={visibility} fill={signals.themeColor !== false ? 'var(--foreground)' : signals.color} />
}

function SignalOutlet({ rings, transition, signals, connectors }) {
  const length = Math.max(...rings.map(ring => ring.size)) / 2
  const end = useTransform(() => length * transition.lines.get())
  return <g pointerEvents="none">
    <motion.line x1={0} y1={0} x2={0} y2={end} stroke="var(--color-neutral-400)" strokeWidth={connectors.thickness} vectorEffect="non-scaling-stroke" opacity={connectors.opacity} />
    {signals.enabled && Array.from({ length: signals.count }, (_, index) => <OutletDot key={index} index={index} length={length} transition={transition} signals={signals} />)}
  </g>
}

function OrbitRing({ ring, wobble, flatten, clock, thickness, opacity, viewX, viewY, solar }) {
  const path = useTransform(() => projectRing(ring.size, ring.tilt, ring.angle + (solar ? 0 : clock.get() * ring.speed), (viewX.get() + wobble.x.get()), (viewY.get() + wobble.y.get()), undefined, undefined, flatten.get()))
  return <motion.path d={path} fill="none" stroke="var(--color-neutral-400)" strokeWidth={thickness} strokeDasharray={ring.dashed ? `${ring.dash ?? 3} ${ring.gap ?? 7}` : undefined} vectorEffect="non-scaling-stroke" opacity={ring.visible ? opacity : 0} />
}

function OrbitLayer({ ring, index, wobble, onHover, onLeave, occupants, dimmed, highlighted, reducedMotion, hitbox, ...props }) {
  return <motion.g animate={{ opacity: dimmed ? 0.2 : 1 }} transition={{ duration: reducedMotion ? 0 : 0.2 }}>
    <OrbitRing ring={ring} wobble={wobble} {...props} opacity={highlighted ? 1 : props.opacity} />
    {occupants.map(item => <OrbitBody key={item.logo.name} {...item} ring={ring} wobble={wobble} {...props} />)}
  </motion.g>
}
function OrbitHitbox({ ring, index, outermost, wobble, onHover, onLeave, highlighted, hitbox, ...props }) {
  // Debug controls can compare the actual moving ring with its stable hit path.
  const hitPath = useTransform(() => projectRing(ring.size, ring.tilt, ring.angle + (props.solar ? 0 : props.clock.get() * ring.speed), props.viewX.get() + (hitbox.followWobble ? wobble.x.get() : 0), props.viewY.get() + (hitbox.followWobble ? wobble.y.get() : 0), undefined, undefined, props.flatten.get()))
  if (!ring.visible) return null
  return <g>
    <motion.path d={hitPath} fill="none" stroke={hitbox.visible ? (highlighted ? '#22c55e' : '#38bdf8') : 'transparent'} strokeOpacity={hitbox.visible ? 0.45 : 0} strokeWidth={outermost ? Math.max(hitbox.width, hitbox.outerWidth ?? 104) : hitbox.width} vectorEffect="non-scaling-stroke" pointerEvents="stroke" onPointerEnter={event => onHover(index, event)} onPointerMove={event => onHover(index, event)} onPointerLeave={onLeave} />
    {hitbox.visible && <motion.path d={hitPath} fill="none" stroke={highlighted ? '#22c55e' : '#38bdf8'} strokeWidth={1.5} vectorEffect="non-scaling-stroke" pointerEvents="none" />}
  </g>
}
/** Four independently oriented planes, all rotating around the same origin. */
export function OrbitGimbal({ rings, clock, thickness = 1, opacity = 0.7, zoom = 85, guides = true, viewX, viewY, solar = false, bodies = true, connectors = defaultConnectors, appearance = defaultAppearance, signals = defaultSignals, signalClock = clock, interaction = defaultInteraction, transition, transitioning = false, fog = defaultFog, hitbox = defaultHitbox, pageOutlet = false }) {
  const boundsRef = useRef(null)
  const visible = useInView(boundsRef, { margin: '100px' })
  const outerRadius = Math.max(...rings.map(ring => ring.size)) / 2
  const logoExtent = bodies && appearance.logos ? Math.max(2.8 * appearance.logoSize * (appearance.fade ? appearance.fadeSize : 0.5), appearance.names ? 1.4 * appearance.logoSize + 0.8 + Math.max(...logos.map(logo => logo.name.length)) * 2.1 * appearance.logoSize : 0) : 0
  const fogBounds = outerRadius + Math.max(logoExtent, 0.32 * signals.size) + 4
  const fadeId = useId()
  const fogId = useId()
  const fogGradientId = useId()
  const fogRadius = Math.max(...rings.map(ring => ring.size)) / 2 * fog.reach / 100
  const reducedMotion = useReducedMotion()
  const [hovered, setHovered] = useState(null)
  const leaveTimer = useRef(null)
  const dragging = useRef(false)
  const pointer = useRef({ x: 0, y: 0, time: 0, dx: 0, dy: 0 })
  const direction = useRef({ x: 0, y: 0, time: 0 })
  function trackPointer(event) {
    if (event.pointerType !== 'mouse') return
    const previous = pointer.current
    const fresh = event.timeStamp - previous.time < 100
    previous.dx = fresh ? event.clientX - previous.x : event.movementX
    previous.dy = fresh ? event.clientY - previous.y : event.movementY
    previous.x = event.clientX; previous.y = event.clientY; previous.time = event.timeStamp
  }
  useEffect(() => {
    const release = () => { dragging.current = false }
    window.addEventListener('pointerup', release)
    window.addEventListener('pointercancel', release)
    return () => { window.clearTimeout(leaveTimer.current); window.removeEventListener('pointerup', release); window.removeEventListener('pointercancel', release) }
  }, [])
  function onHover(index, event) {
    if (event.pointerType !== 'mouse' || event.buttons || dragging.current || transitioning) return
    const dx = pointer.current.dx || event.movementX || 0
    const dy = pointer.current.dy || event.movementY || 0
    const distance = Math.hypot(dx, dy)
    if (distance > 0.1) {
      // Screen-space push: horizontal travel drives Y tilt; vertical drives X.
      const amount = Math.min(1, distance / interaction.sensitivity)
      direction.current.x = -dy / distance * amount
      direction.current.y = dx / distance * amount
      direction.current.time = performance.now()
    }
    window.clearTimeout(leaveTimer.current)
    setHovered(index)
  }
  function onLeave() {
    window.clearTimeout(leaveTimer.current)
    leaveTimer.current = window.setTimeout(() => setHovered(null), hitbox.releaseDelay)
  }
  const ringOrder = rings.map((ring, index) => ({ size: ring.size, index })).sort((a, b) => a.size - b.size)
  const focusedRing = hovered !== null && hovered !== ringOrder[0]?.index ? hovered : null
  useEffect(() => { if (transitioning || !visible) setHovered(null) }, [transitioning, visible])
  const order = ringOrder.map(ring => ring.index)
  const [wobbles] = useState(() => rings.map(() => ({ x: motionValue(0), y: motionValue(0) })))
  const [dynamics] = useState(() => Array.from({ length: 2 }, () => ({ position: new Float64Array(rings.length), velocity: new Float64Array(rings.length), acceleration: new Float64Array(rings.length), pressure: 0 })))
  useEffect(() => {
    if (!interaction.enabled || reducedMotion) {
      for (const axis of dynamics) { axis.position.fill(0); axis.velocity.fill(0); axis.acceleration.fill(0); axis.pressure = 0 }
      for (const wobble of wobbles) { wobble.x.jump(0); wobble.y.jump(0) }
      direction.current.x = 0; direction.current.y = 0
    }
  }, [interaction.enabled, reducedMotion, dynamics, wobbles])
  useAnimationFrame((_, delta) => {
    if (!visible || !interaction.enabled || reducedMotion || document.hidden) return
    // Stop the physics solver once an untouched ring has settled.
    if (hovered === null && dynamics.every(axis => axis.position.every(value => Math.abs(value) < 0.0001) && axis.velocity.every(value => Math.abs(value) < 0.0001))) {
      for (const wobble of wobbles) { wobble.x.set(0); wobble.y.set(0) }
      return
    }
    const duration = Math.min(delta / 1000, 0.04)
    const steps = Math.max(1, Math.ceil(duration / (1 / 120)))
    // A stationary pointer stops pushing; the existing momentum settles naturally.
    const decay = Math.exp(-Math.max(0, performance.now() - direction.current.time - 60) / interaction.release)
    for (let step = 0; step < steps; step++) {
      stepRingDynamics(dynamics[0], order, transitioning ? null : hovered, transitioning ? 0 : interaction.strength * direction.current.x * decay, duration / steps, interaction)
      stepRingDynamics(dynamics[1], order, transitioning ? null : hovered, transitioning ? 0 : interaction.strength * direction.current.y * decay, duration / steps, interaction)
    }
    for (let i = 0; i < wobbles.length; i++) { wobbles[i].x.set(dynamics[0].position[i]); wobbles[i].y.set(dynamics[1].position[i]) }
  })
  // The innermost ring stays empty. Assign each logo once, then space each
  // ring's occupants at equal angular intervals (two occupants = 180° apart).
  const occupiedRings = ringOrder.slice(1)
  const orbitLogos = occupiedRings.flatMap((entry, rank) => {
    const assigned = logos.map((logo, index) => ({ logo, index })).filter(item => item.index % occupiedRings.length === rank)
    return assigned.map((item, slot) => ({ ...item, ringIndex: entry.index, phase: rank * 45 + slot * 360 / assigned.length }))
  })
  return <div ref={boundsRef} className="og-gimbal-bounds" style={{ width: `${zoom}%` }}>
    <svg className="og-gimbal" viewBox="-50 -50 100 100" width="100%" height="100%" overflow="visible" aria-hidden="true" onPointerMoveCapture={trackPointer} onPointerDownCapture={() => { dragging.current = true; window.clearTimeout(leaveTimer.current); setHovered(null) }}>
      <defs><radialGradient id={fadeId}><stop offset="0%" stopColor="var(--mv-page-background, var(--background))" stopOpacity={appearance.fadeOpacity} /><stop offset={`${100 - appearance.fadeSoftness}%`} stopColor="var(--mv-page-background, var(--background))" stopOpacity={appearance.fadeOpacity * 0.76} /><stop offset="100%" stopColor="var(--mv-page-background, var(--background))" stopOpacity="0" /></radialGradient></defs>
      <defs>
        <radialGradient id={fogGradientId} gradientUnits="userSpaceOnUse" cx="0" cy="0" r={fogRadius}>
          <stop offset="0%" stopColor="white" stopOpacity="1" />
          <stop offset={fog.start + '%'} stopColor="white" stopOpacity="1" />
          <motion.stop offset="100%" stopColor="white" animate={{ stopOpacity: focusedRing !== null ? 1 : 1 - fog.strength }} transition={{ duration: reducedMotion ? 0 : 0.2 }} />
        </radialGradient>
        <mask id={fogId} maskUnits="userSpaceOnUse" x={-fogBounds} y={-fogBounds} width={fogBounds * 2} height={fogBounds * 2} style={{ maskType: 'alpha' }}>
          <rect x={-fogBounds} y={-fogBounds} width={fogBounds * 2} height={fogBounds * 2} fill={'url(#' + fogGradientId + ')'} />
        </mask>
      </defs>
      <g mask={fog.enabled ? 'url(#' + fogId + ')' : undefined}>
      {rings.map((ring, index) => <OrbitLayer key={index} hitbox={hitbox} dimmed={focusedRing !== null && focusedRing !== index && index !== ringOrder[0]?.index} highlighted={focusedRing === index} reducedMotion={reducedMotion} ring={ring} index={index} wobble={wobbles[index]} flatten={transition.rings[index]} lineAlignment={transition.alignments[index]} logoProgress={transition.logos} dotAlignment={transition.dots} occupants={orbitLogos.filter(item => item.ringIndex === index)} onHover={onHover} onLeave={onLeave} clock={clock} thickness={thickness} opacity={opacity} viewX={viewX} viewY={viewY} solar={solar} bodies={bodies} connectors={connectors} appearance={appearance} signals={signals} signalClock={signalClock} fadeId={fadeId} />)}
      </g>
      {rings.map((ring, index) => <OrbitHitbox key={index} outermost={index === ringOrder[ringOrder.length - 1]?.index} ring={ring} index={index} wobble={wobbles[index]} flatten={transition.rings[index]} clock={clock} viewX={viewX} viewY={viewY} solar={solar} hitbox={hitbox} highlighted={focusedRing === index} onHover={onHover} onLeave={onLeave} />)}
      {connectors.enabled && !pageOutlet && <SignalOutlet rings={rings} transition={transition} signals={signals} connectors={connectors} />}
    </svg>
    {guides && <div className="og-guides" aria-hidden="true"><i /><i /><span /><b>+</b><b>+</b><b>+</b><b>+</b></div>}
    <span className={`og-center${solar ? ' og-sun' : ''}`} aria-hidden="true" />
  </div>
}

function Control({ label, value, onChange, min, max, step = 1, unit = '' }) {
  return <label className="og-control"><span>{label}<output>{value}{unit}</output></span><input type="range" min={min} max={max} step={step} value={value} onChange={event => onChange(Number(event.target.value))} /></label>
}

function TiltControl({ label, value }) {
  const normalize = angle => Math.round(((angle + 180) % 360 + 360) % 360 - 180)
  const [degrees, setDegrees] = useState(() => normalize(value.get()))
  useEffect(() => value.on('change', angle => setDegrees(normalize(angle))), [value])
  return <Control label={label} value={degrees} onChange={angle => value.set(angle)} min={-180} max={180} unit="°" />
}

function ControlGroup({ title, children }) {
  const [open, setOpen] = useSavedSetting(`panel:${title}`, title === 'Scene')
  return <details className="og-control-group" open={open} onToggle={event => setOpen(event.currentTarget.open)}><summary>{title}</summary><div className="og-group-content">{children}</div></details>
}

export default function OrbitPlayground({ embedded = false }) {
  const reducedMotion = useReducedMotion()
  const [playing, setPlaying] = useSavedSetting('playing', true)
  const [rings, setRings] = useSavedSetting('rings', solarRings)
  const [solar, setSolar] = useSavedSetting('solar', true)
  const [bodies, setBodies] = useSavedSetting('bodies', true)
  const [fog, setFog] = useSavedSetting('fog', defaultFog)
  const [hitbox, setHitbox] = useSavedSetting('hitbox', defaultHitbox)
  useEffect(() => {
    if (readSetting('hitbox-width-72-104', false)) return
    setHitbox(current => ({ ...current, width: Math.max(72, current.width ?? 72), outerWidth: Math.max(104, current.outerWidth ?? 104), visible: false }))
    saveSetting('hitbox-width-72-104', true)
  }, [setHitbox])
  useEffect(() => {
    if (readSetting('hitbox-width-56-hidden', false)) return
    setHitbox(current => ({ ...current, width: Math.max(56, current.width ?? 56), visible: false }))
    saveSetting('hitbox-width-56-hidden', true)
  }, [setHitbox])
  useEffect(() => {
    if (readSetting('hitbox-width-44', false)) return
    setHitbox(current => ({ ...current, width: Math.max(44, current.width ?? 44) }))
    saveSetting('hitbox-width-44', true)
  }, [setHitbox])
  useEffect(() => {
    if (readSetting('hitbox-overlay-hidden-v3', false)) return
    setHitbox(current => ({ ...current, visible: false }))
    saveSetting('hitbox-overlay-hidden-v3', true)
  }, [setHitbox])
  const [appearance, setAppearance] = useSavedSetting('appearance', defaultAppearance)
  const [signals, setSignals] = useSavedSetting('signals', defaultSignals)
  useEffect(() => {
    if (readSetting('faster-signals-applied', false)) return
    setSignals(current => ({ ...current, duration: current.duration === 3 ? 1.5 : current.duration }))
    saveSetting('faster-signals-applied', true)
  }, [setSignals])
  const [interaction, setInteraction] = useSavedSetting('interaction', defaultInteraction)
  const [connectors, setConnectors] = useSavedSetting('connectors', defaultConnectors)
  const updateConnector = (key, value) => setConnectors(current => ({ ...current, [key]: value }))
  const [selected, setSelected] = useSavedSetting('selected', 0)
  const [speed, setSpeed] = useSavedSetting('speed', 0.7)
  const [zoom, setZoom] = useSavedSetting('zoom', 131)
  const [thickness, setThickness] = useSavedSetting('thickness', 0.5)
  const [opacity, setOpacity] = useSavedSetting('opacity', 0.5)
  const [guides, setGuides] = useSavedSetting('guides', false)
  const dark = true
  const [phase, setPhase] = useState('idle')
  const [copyStatus, setCopyStatus] = useState('')
  const [panelOpen, setPanelOpen] = useSavedSetting('home-panel-open', false)
  const [scrollDistance, setScrollDistance] = useSavedSetting('scroll-distance', 300)
  const scrollDriven = useRef(false)
  const scrollTarget = useRef(0)
  const smoothScroll = useRef(0)
  const homeRef = useRef(null)
  const [transition] = useState(() => ({ rings: solarRings.map(() => motionValue(0)), alignments: solarRings.map(() => motionValue(0)), logos: motionValue(1), lines: motionValue(0), dots: motionValue(0), outbound: motionValue(0) }))
  const sequence = useRef({ id: 0, animations: [] })
  function cancelSequence() {
    sequence.current.id++
    for (const animation of sequence.current.animations) animation.stop()
    sequence.current.animations = []
  }
  useEffect(() => () => cancelSequence(), [])
  async function playTransition(fromScroll = false) {
    cancelSequence()
    const id = sequence.current.id
    scrollDriven.current = fromScroll === true
    if (!scrollDriven.current || phase === 'idle') {
      for (const value of [...transition.rings, ...transition.alignments]) value.set(0)
      transition.logos.set(1)
      transition.lines.set(0)
      transition.dots.set(0)
      transition.outbound.set(0)
      smoothScroll.current = 0
    }
    if (reducedMotion) {
      ;[...transition.rings, ...transition.alignments].forEach(value => value.set(1))
      transition.logos.set(0); transition.lines.set(1); transition.dots.set(1)
      setPhase('complete')
      return
    }
    setPhase('rings')
    const order = rings.map((ring, index) => ({ size: ring.size, index })).sort((a, b) => a.size - b.size)
    const animations = scrollDriven.current ? [] : order.map(({ index }, rank) => animate(transition.rings[index], 1, { ...ringTransition, delay: rank * ringStagger }))
    const alignments = order.map(({ index }, rank) => animate(transition.alignments[index], 1, {
      ...lineTransition,
      delay: rank * lineStagger,
    }))
    const dots = animate(transition.dots, 1, {
      duration: 1.6,
      ease: [0, 0.744, 0.284, 0.924],
    })
    // Embedded outlet follows the same smoothed scroll progress as the rings.
    const lines = scrollDriven.current ? [] : [animate(transition.lines, 1, {
      ...outletTransition,
    })]
    const logoExit = animate(transition.logos, 0, logoTransition)
    sequence.current.animations = [...animations, ...alignments, dots, ...lines, logoExit]
    await Promise.all(sequence.current.animations)
    if (id === sequence.current.id) setPhase('complete')
  }
  async function resetTransition() {
    cancelSequence()
    const id = sequence.current.id
    scrollTarget.current = 0
    const wasScrollDriven = scrollDriven.current
    // Restart emission at the logos instead of reversing the collection animation.
    signalClock.set(0)
    transition.dots.set(0)
    setPhase('resetting')
    const order = rings.map((ring, index) => ({ size: ring.size, index })).sort((a, b) => a.size - b.size)
    const reverse = (value, options, delay = options.delay ?? 0) => animate(value, 0, reducedMotion ? { duration: 0 } : { ...options, delay })
    const animations = [
      animate(transition.logos, 1, reducedMotion ? { duration: 0 } : logoTransition),
      ...order.map(({ index }, rank) => reverse(transition.alignments[index], lineTransition, rank * lineStagger)),
      ...(wasScrollDriven ? [] : order.map(({ index }, rank) => reverse(transition.rings[index], ringTransition, rank * ringStagger))),
      ...(wasScrollDriven ? [] : [reverse(transition.lines, outletTransition)]),
    ]
    sequence.current.animations = animations
    await Promise.all(animations)
    if (id === sequence.current.id) { scrollDriven.current = false; setPhase('idle') }
  }
  const stageRef = useRef(null)
  const orbitInView = useInView(stageRef, { margin: '100px' })
  const sortedRings = useMemo(() => rings.map((ring, index) => ({ size: ring.size, index })).sort((a, b) => a.size - b.size), [rings])
  useEffect(() => {
    if (embedded) return
    const stage = stageRef.current
    function wheelZoom(event) {
      event.preventDefault()
      const delta = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? stage.clientHeight : 1)
      setZoom(current => Math.round(Math.min(200, Math.max(35, current * Math.exp(-Math.max(-200, Math.min(200, delta)) * 0.002)))))
    }
    stage.addEventListener('wheel', wheelZoom, { passive: false })
    return () => stage.removeEventListener('wheel', wheelZoom)
  }, [])
  const clock = useMotionValue(0)
  const signalClock = useMotionValue(0)
  const [savedView] = useState(() => ({ x: readSetting('viewX', -101), y: readSetting('viewY', 51) }))
  const viewX = useMotionValue(savedView.x)
  const viewY = useMotionValue(savedView.y)
  useEffect(() => {
    let timer
    const flush = () => {
      window.clearTimeout(timer)
      saveSetting('viewX', viewX.get()); saveSetting('viewY', viewY.get())
    }
    const schedule = () => { window.clearTimeout(timer); timer = window.setTimeout(flush, 150) }
    const stopX = viewX.on('change', schedule)
    const stopY = viewY.on('change', schedule)
    window.addEventListener('pagehide', flush)
    return () => { flush(); stopX(); stopY(); window.removeEventListener('pagehide', flush) }
  }, [viewX, viewY])
  useAnimationFrame((_, delta) => {
    if (embedded && scrollDriven.current && smoothScroll.current !== scrollTarget.current) {
      const blend = reducedMotion ? 1 : 1 - Math.exp(-Math.min(delta, 64) / 180)
      const remaining = scrollTarget.current - smoothScroll.current
      smoothScroll.current = Math.abs(remaining) < 0.0001 ? scrollTarget.current : smoothScroll.current + remaining * blend
      transition.lines.set(Math.max(0, Math.min(1, smoothScroll.current)))
      const order = sortedRings
      for (let rank = 0; rank < order.length; rank++) {
        transition.rings[order[rank].index].set(Math.max(0, Math.min(1, smoothScroll.current * 1.6 - rank * 0.2)))
      }
    }
    if ((phase === 'idle' || phase === 'resetting') && orbitInView && playing && !reducedMotion && !document.hidden) clock.set(clock.get() + Math.min(delta, 50) / 1000 * speed)
    if (signals.enabled && connectors.enabled && !reducedMotion && !document.hidden) {
      if (orbitInView && (phase === 'idle' || phase === 'resetting')) signalClock.set(signalClock.get() + Math.min(delta, 50) / 1000)
      if ((!embedded || (signals.pageCount ?? 6) > 0) && phase !== 'idle' && phase !== 'resetting') transition.outbound.set(transition.outbound.get() + Math.min(delta, 50) / 1000)
    }
  })
  const updateRing = (key, value) => setRings(current => current.map((ring, index) => index === selected ? { ...ring, [key]: value } : ring))
  const ringGap = Number(((Math.max(...rings.map(ring => ring.size)) - Math.min(...rings.map(ring => ring.size))) / (2 * (rings.length - 1))).toFixed(1))
  function updateRingGap(gap) {
    setRings(current => {
      const order = current.map((ring, index) => ({ index, size: ring.size })).sort((a, b) => a.size - b.size)
      const outerDiameter = Math.max(order[order.length - 1].size, 15 + gap * 2 * (current.length - 1))
      return current.map((ring, index) => ({ ...ring, size: Number((outerDiameter - 2 * gap * (current.length - 1 - order.findIndex(item => item.index === index))).toFixed(1)) }))
    })
  }
  function reset() {
    scrollDriven.current = false
    cancelSequence(); [...transition.rings, ...transition.alignments].forEach(value => value.set(0)); transition.logos.set(1); transition.lines.set(0); transition.dots.set(0); transition.outbound.set(0); setPhase('idle')
    setConnectors(defaultConnectors)
    setInteraction(defaultInteraction)
    setFog(defaultFog)
    setHitbox(defaultHitbox)
    setAppearance(defaultAppearance); setSignals(defaultSignals); signalClock.set(0)
    setRings(solar ? solarRings : initialRings); setBodies(true); setSpeed(0.7); setZoom(131); setThickness(0.5); setOpacity(0.5); setGuides(false); setPlaying(true)
    clock.set(0); viewX.set(-101); viewY.set(51)
  }
  async function copyAllProperties() {
    const properties = {
      scene: { solar, playing, speed, zoom, viewX: viewX.get(), viewY: viewY.get(), thickness, opacity, guides, dark, scrollDistance },
      rings,
      bodies,
      connectors,
      interaction,
      fog,
      hitbox,
      appearance,
      signals,
    }
    try {
      await navigator.clipboard.writeText(JSON.stringify(properties, null, 2))
      setCopyStatus('All properties copied')
    } catch {
      setCopyStatus('Could not copy properties')
    }
  }
  function handleKey(event) {
    const directions = { ArrowUp: [-5, 0], ArrowDown: [5, 0], ArrowLeft: [0, -5], ArrowRight: [0, 5] }
    const delta = directions[event.key]
    if (!delta) return
    event.preventDefault(); viewX.set(viewX.get() + delta[0]); viewY.set(viewY.get() + delta[1])
  }
  useEffect(() => {
    if (!embedded) return
    function onScroll() {
      scrollTarget.current = Math.max(0, Math.min(1, (window.scrollY - 8) / scrollDistance))
      // Hysteresis prevents repeated starts when scrolling around the top edge.
      if (window.scrollY <= 2 && scrollDriven.current && phase !== 'resetting') {
        resetTransition()
      } else if (window.scrollY > 8 && ((!scrollDriven.current && phase === 'idle') || phase === 'resetting')) {
        playTransition(true)
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [embedded, phase, rings, scrollDistance, reducedMotion])
  const controls = <aside className="og-panel" aria-label="Debug controls">
        <ScrollArea className="og-panel-scroll" overscrollContain>
        <div className="og-panel-content">
        <div className="og-panel-heading"><h2>Debug panel</h2>{embedded && <Button variant="ghost" size="sm" onClick={() => setPanelOpen(false)}>Close</Button>}<span>01—04</span></div>
        <div className="og-actions"><Button variant="ghost" onClick={reset}>Reset all</Button><Button variant="outline" onClick={copyAllProperties}>Copy all properties</Button></div>
        {copyStatus && <p className="og-note" role="status">{copyStatus}</p>}
        <div className="og-actions"><Button onClick={playTransition} disabled={phase !== 'idle' && phase !== 'complete'}>{phase === 'complete' ? 'Replay transition' : 'Play transition'}</Button><Button variant="outline" onClick={resetTransition} disabled={phase === 'idle'}>Reset</Button></div>
        <p className="og-note" role="status">{phase === 'rings' ? '1 / 2 · Turning rings face-on and hiding logos' : phase === 'signals' ? '2 / 2 · Drawing outward signal line' : phase === 'complete' ? 'Transition complete' : phase === 'resetting' ? 'Restoring orbit' : 'Ready to test transition'}</p>
        {reducedMotion && <p className="og-note">Autoplay is off to respect your reduced motion setting. All controls still work.</p>}
        <ControlGroup title="Scene">{embedded && <Control label="Scroll distance" value={scrollDistance} onChange={setScrollDistance} min={200} max={1200} step={50} unit="px" />}
          <div className="og-ring-picker" role="group" aria-label="Orbit layout">{[true, false].map(value => <Button key={String(value)} variant={solar === value ? 'default' : 'outline'} aria-pressed={solar === value} onClick={() => { setSolar(value); setRings(value ? solarRings : initialRings); clock.set(0) }}>{value ? 'Solar system' : 'Gimbal'}</Button>)}</div>

          <label className="og-check"><input type="checkbox" role="switch" checked={playing && !reducedMotion} disabled={Boolean(reducedMotion)} onChange={event => setPlaying(event.target.checked)} />Auto rotation</label>
          <Control label="Playback speed" value={speed} onChange={setSpeed} min={0} max={3} step={0.1} unit="×" />
          <TiltControl label="Whole orbit · X tilt" value={viewX} />
          <TiltControl label="Whole orbit · Y tilt" value={viewY} />
          <Control label="Scale" value={zoom} onChange={setZoom} min={35} max={embedded ? 400 : 200} unit="%" />
          <Control label="Ring gap" value={ringGap} onChange={updateRingGap} min={0} max={14} step={0.5} unit="%" />

          <Control label="Stroke" value={thickness} onChange={setThickness} min={0.5} max={3} step={0.25} unit="px" />
          <Control label="Opacity" value={opacity} onChange={setOpacity} min={0.1} max={1} step={0.05} />
          <label className="og-check"><input type="checkbox" checked={guides} onChange={event => setGuides(event.target.checked)} />Center & axis guides</label>
        </ControlGroup>
        <ControlGroup title="Hover hitboxes">
          <label className="og-check"><input type="checkbox" checked={hitbox.visible} onChange={event => setHitbox(current => ({ ...current, visible: event.target.checked }))} />Show hitbox overlay</label>
          <Control label="Hitbox width" value={hitbox.width} onChange={width => setHitbox(current => ({ ...current, width }))} min={4} max={140} step={2} unit="px" />
          <Control label="Outer ring hitbox width" value={hitbox.outerWidth ?? 104} onChange={outerWidth => setHitbox(current => ({ ...current, outerWidth }))} min={4} max={180} step={2} unit="px" />
          <label className="og-check"><input type="checkbox" checked={hitbox.followWobble} onChange={event => setHitbox(current => ({ ...current, followWobble: event.target.checked }))} />Follow ring wobble</label>
          <Control label="Hover release delay" value={hitbox.releaseDelay} onChange={releaseDelay => setHitbox(current => ({ ...current, releaseDelay }))} min={0} max={500} step={20} unit="ms" />
          <p className="og-note">Blue shows the hover area; green marks the highlighted ring. Width stays constant when scaling.</p>
        </ControlGroup>
        <ControlGroup title="Hover interaction">
          <label className="og-check"><input type="checkbox" checked={interaction.enabled} onChange={event => setInteraction(current => ({ ...current, enabled: event.target.checked }))} />Ring disturbance</label>
          <Control label="Strength" value={interaction.strength} onChange={strength => setInteraction(current => ({ ...current, strength }))} min={1} max={14} unit="°" />
          <Control label="Mouse travel for full push" value={interaction.sensitivity} onChange={sensitivity => setInteraction(current => ({ ...current, sensitivity }))} min={1} max={20} unit="px" />
          <Control label="Release fade" value={interaction.release} onChange={release => setInteraction(current => ({ ...current, release }))} min={50} max={1000} step={25} unit="ms" />
          <label className="og-control"><span>Neighbor direction</span><select value={interaction.counter ? 'opposite' : 'follow'} onChange={event => setInteraction(current => ({ ...current, counter: event.target.value === 'opposite' }))}><option value="opposite">Counter-tilt</option><option value="follow">Follow the push</option></select></label>
          <details className="og-control-group"><summary>Physics tuning</summary><div className="og-group-content">
            <Control label="Mass · weight" value={interaction.mass} onChange={mass => setInteraction(current => ({ ...current, mass }))} min={0.5} max={6} step={0.25} />
            <Control label="Damping · less bounce" value={interaction.damping} onChange={damping => setInteraction(current => ({ ...current, damping }))} min={5} max={45} />
            <Control label="Stiffness · return force" value={interaction.stiffness} onChange={stiffness => setInteraction(current => ({ ...current, stiffness }))} min={5} max={60} />
            <Control label="Coupling · neighbor influence" value={interaction.coupling} onChange={coupling => setInteraction(current => ({ ...current, coupling }))} min={0} max={60} />
            <Control label="Cascade lag" value={interaction.cascade} onChange={cascade => setInteraction(current => ({ ...current, cascade }))} min={0} max={2} step={0.1} />
            <Control label="Response · pressure buildup" value={interaction.response} onChange={response => setInteraction(current => ({ ...current, response }))} min={2} max={20} />
            <p className="og-note">More mass slows movement. More damping reduces bounce. Cascade lag adds weight to each successive neighbor; it is not a fixed delay.</p>
          </div></details>
          <Button variant="ghost" onClick={() => setInteraction(defaultInteraction)}>Reset interaction</Button>
        </ControlGroup>
        <ControlGroup title="Atmosphere">
          <label className="og-check"><input type="checkbox" checked={fog.enabled} onChange={event => setFog(current => ({ ...current, enabled: event.target.checked }))} />Outer fog</label>
          <Control label="Fog strength" value={fog.strength} onChange={strength => setFog(current => ({ ...current, strength }))} min={0} max={1} step={0.05} />
          <Control label="Fade begins" value={fog.start} onChange={start => setFog(current => ({ ...current, start }))} min={0} max={95} step={5} unit="%" />
          <Control label="Fog radius" value={fog.reach} onChange={reach => setFog(current => ({ ...current, reach }))} min={50} max={200} step={5} unit="%" />
        </ControlGroup>
        <ControlGroup title="Logos">
          <label className="og-check"><input type="checkbox" checked={bodies} onChange={event => setBodies(event.target.checked)} />Show orbiting logos</label>
          <Control label="Logo size" value={appearance.logoSize} onChange={logoSize => setAppearance(current => ({ ...current, logoSize }))} min={0.25} max={3} step={0.25} unit="×" />
          <label className="og-check"><input type="checkbox" checked={appearance.names} onChange={event => setAppearance(current => ({ ...current, names: event.target.checked }))} />Show names</label>
          <details className="og-control-group"><summary>Background fade</summary><div className="og-group-content">
            <label className="og-check"><input type="checkbox" checked={appearance.fade} onChange={event => setAppearance(current => ({ ...current, fade: event.target.checked }))} />Show fade</label>
            <Control label="Fade radius" value={appearance.fadeSize} onChange={fadeSize => setAppearance(current => ({ ...current, fadeSize }))} min={0.5} max={4} step={0.1} unit="×" />
            <Control label="Opacity" value={appearance.fadeOpacity} onChange={fadeOpacity => setAppearance(current => ({ ...current, fadeOpacity }))} min={0} max={1} step={0.05} />
            <Control label="Softness" value={appearance.fadeSoftness} onChange={fadeSoftness => setAppearance(current => ({ ...current, fadeSoftness }))} min={5} max={100} step={5} unit="%" />
          </div></details>
        </ControlGroup>
        <ControlGroup title="Lines & signals">
          <label className="og-check"><input type="checkbox" role="switch" checked={connectors.enabled} onChange={event => updateConnector('enabled', event.target.checked)} />Show center lines</label>
          <Control label="Line thickness" value={connectors.thickness} onChange={value => updateConnector('thickness', value)} min={0.25} max={2} step={0.25} unit="px" />
          <Control label="Line opacity" value={connectors.opacity} onChange={value => updateConnector('opacity', value)} min={0.05} max={1} step={0.05} />
          <label className="og-check"><input type="checkbox" checked={connectors.dashed} onChange={event => updateConnector('dashed', event.target.checked)} />Dashed center lines</label>
          <label className="og-check"><input type="checkbox" role="switch" checked={signals.enabled} onChange={event => setSignals(current => ({ ...current, enabled: event.target.checked }))} />Traveling dots</label>
            <Control label="Signal size" value={signals.size} onChange={size => setSignals(current => ({ ...current, size }))} min={0.25} max={4} step={0.25} unit="?" />
          {signals.enabled && <>
            <Control label="Max simultaneous signals" value={signals.count} onChange={count => setSignals(current => ({ ...current, count }))} min={0} max={logos.length} />
            <Control label="Signal size" value={signals.size} onChange={size => setSignals(current => ({ ...current, size }))} min={0.25} max={4} step={0.25} unit="×" />
            <label className="og-check"><input type="checkbox" checked={signals.themeColor !== false} onChange={event => setSignals(current => ({ ...current, themeColor: event.target.checked }))} />Match signal color to theme</label>
            <label className="og-signal-color"><span>Signal color</span><input type="color" aria-label="Signal color" value={signals.color} onChange={event => setSignals(current => ({ ...current, color: event.target.value, themeColor: false }))} /></label>
            <Control label="Page line dots" value={signals.pageCount ?? 6} onChange={pageCount => setSignals(current => ({ ...current, pageCount }))} min={0} max={16} />
            <Control label="Travel time" value={signals.duration} onChange={duration => setSignals(current => ({ ...current, duration }))} min={1} max={8} step={0.5} unit="s" />
            <div className="og-ring-picker" role="group" aria-label="Signal direction">{[false, true].map(outward => <Button key={String(outward)} variant={signals.outward === outward ? 'default' : 'outline'} aria-pressed={signals.outward === outward} onClick={() => setSignals(current => ({ ...current, outward }))}>{outward ? 'Outward' : 'To center'}</Button>)}</div>
          </>}
        </ControlGroup>
        <ControlGroup title="Individual rings"><div className="og-ring-picker" role="group" aria-label="Select ring">{rings.map((_, index) => <Button key={index} variant={selected === index ? 'default' : 'outline'} aria-pressed={selected === index} onClick={() => setSelected(index)}>0{index + 1}</Button>)}</div>
          <label className="og-check"><input type="checkbox" checked={rings[selected].visible} onChange={event => updateRing('visible', event.target.checked)} />Show ring {selected + 1}</label>
          <label className="og-check"><input type="checkbox" checked={rings[selected].connector !== false} onChange={event => updateRing('connector', event.target.checked)} />Connect this ring to center</label>
          <label className="og-check"><input type="checkbox" checked={Boolean(rings[selected].dashed)} onChange={event => updateRing('dashed', event.target.checked)} />Dashed stroke</label>
          {rings[selected].dashed && <><Control label="Dash length" value={rings[selected].dash ?? 3} onChange={value => updateRing('dash', value)} min={1} max={20} unit="px" /><Control label="Dash gap" value={rings[selected].gap ?? 7} onChange={value => updateRing('gap', value)} min={1} max={24} unit="px" /></>}
          <Control label="Plane tilt" value={rings[selected].tilt} onChange={value => updateRing('tilt', value)} min={0} max={90} unit="°" />
          <Control label="Starting rotation" value={rings[selected].angle} onChange={value => updateRing('angle', value)} min={-180} max={180} unit="°" />
          <Control label={solar ? 'Orbital speed' : 'Rotation speed'} value={rings[selected].speed} onChange={value => updateRing('speed', value)} min={-30} max={30} unit="°/s" />
          <Control label="Diameter" value={rings[selected].size} onChange={value => updateRing('size', value)} min={15} max={100} unit="%" />
        </ControlGroup>
        <p className="og-note">{solar ? 'Bodies travel along fixed orbital planes. Negative speed reverses their direction.' : 'Negative speed reverses rotation. Tilt turns a circle into an orbital plane.'}</p>
        </div>
        </ScrollArea>
      </aside>
  if (embedded) return <div ref={homeRef} className="og-home-orbit" data-reveal-skip>
    <div ref={stageRef} className="og-home-stage" role="group" aria-label="Interactive orbit. Hover over the rings to disturb them.">
      <OrbitGimbal pageOutlet rings={rings} clock={clock} thickness={thickness} opacity={opacity} zoom={zoom} guides={guides} viewX={viewX} viewY={viewY} solar={solar} bodies={bodies} connectors={connectors} appearance={appearance} signals={signals} signalClock={signalClock} interaction={interaction} transitioning={phase !== 'idle' && phase !== 'resetting'} transition={transition} fog={fog} hitbox={hitbox} />
    </div>
    <PageSignalOutlet strokeOpacity={opacity} homeRef={homeRef} transition={transition} signals={signals} connectors={connectors} zoom={zoom} />
      {SHOW_DEBUG_CONTROLS && (panelOpen ? <div className="og-home-panel">{controls}</div> : <Button className="og-home-panel-toggle" variant="outline" onClick={() => setPanelOpen(true)}>Orbit controls</Button>)}
  </div>
  return <main className={`og-page ${dark ? 'dark' : ''}`}>
    <h1 className="sr-only">Orbit playground</h1>
    <div className="og-workspace">
      <section className="og-canvas" aria-label="Orbit preview">
        <motion.div ref={stageRef} className="og-stage" tabIndex={0} role="group" aria-label="Interactive orbit gimbal. Drag or use arrow keys to rotate. Use the mouse wheel to zoom." onKeyDown={handleKey} onPan={(_, info) => { viewY.set(viewY.get() + info.delta.x * 0.3); viewX.set(viewX.get() - info.delta.y * 0.3) }}>
          <OrbitGimbal rings={rings} clock={clock} thickness={thickness} opacity={opacity} zoom={zoom} guides={guides} viewX={viewX} viewY={viewY} solar={solar} bodies={bodies} connectors={connectors} appearance={appearance} signals={signals} signalClock={signalClock} interaction={interaction} transitioning={phase !== 'idle' && phase !== 'resetting'} transition={transition} fog={fog} hitbox={hitbox} />
        </motion.div>
      </section>
{SHOW_DEBUG_CONTROLS && controls}
    </div>
  </main>
}
