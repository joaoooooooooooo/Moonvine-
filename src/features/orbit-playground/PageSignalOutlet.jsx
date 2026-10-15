import { useEffect, useId, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, useScroll, useTransform } from 'motion/react'
const SIGNAL_DISTANCE = 600
const TIP_FADE_LENGTH = 180

// Layout-time sampling avoids SVG geometry reads on animation frames.
function samplePath(d) {
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
  path.setAttribute('d', d)
  const length = path.getTotalLength()
  const count = Math.max(1, Math.ceil(length / 3))
  const points = Array.from({ length: count + 1 }, (_, index) => {
    const point = path.getPointAtLength(index / count * length)
    return { x: point.x, y: point.y }
  })
  return { length, points }
}
function pointAt(geometry, distance) {
  if (!geometry) return { x: 0, y: 0 }
  const position = Math.max(0, Math.min(1, distance / Math.max(1, geometry.length))) * (geometry.points.length - 1)
  const index = Math.min(Math.floor(position), geometry.points.length - 2)
  const fraction = position - index
  const a = geometry.points[index], b = geometry.points[index + 1]
  return { x: a.x + (b.x - a.x) * fraction, y: a.y + (b.y - a.y) * fraction }
}
function PageSignalDot({ index, geometry, radius, end, transition, signals }) {
  const distance = useTransform(() => transition.outbound.get() * SIGNAL_DISTANCE / signals.duration - index * geometry.length / Math.max(1, signals.pageCount ?? 6))
  const along = useTransform(() => Math.max(0, distance.get()) % Math.max(1, geometry.length))
  const position = useTransform(() => pointAt(geometry, along.get()))
  const x = useTransform(() => position.get().x)
  const y = useTransform(() => position.get().y)
  const visibility = useTransform(() => distance.get() >= 0 && along.get() < end.get() ? 'visible' : 'hidden')
  const opacity = useTransform(() => Math.max(0, Math.min(1, (end.get() - along.get()) / TIP_FADE_LENGTH)))
  return <motion.circle cx={x} cy={y} r={radius} visibility={visibility} opacity={opacity} fill={signals.themeColor !== false ? 'var(--foreground)' : signals.color} />
}
export function PageSignalOutlet({ homeRef, transition, signals, connectors, zoom, strokeOpacity }) {
  const [geometry, setGeometry] = useState(null)
  const fadeId = useId()
  const { scrollY } = useScroll()
  useEffect(() => {
    const page = homeRef.current?.closest('.mv-website')
    const orbit = homeRef.current?.querySelector('.og-gimbal')
    const connections = page?.querySelector('#connections')
    const connectionsHeading = connections?.querySelector('#connections-heading')
    let measureFrame = 0
    if (!page || !orbit) return
    const measure = () => {
      const bounds = page.getBoundingClientRect()
      const ring = orbit.getBoundingClientRect()
      const top = ring.top + ring.height / 2 - bounds.top
      const left = ring.left + ring.width / 2 - bounds.left
      const height = Math.max(1, bounds.height - top)
      let d = `M ${left} 0 V ${height}`
      if (connections && connectionsHeading) {
        const heading = connectionsHeading.getBoundingClientRect()
        const targetX = heading.left - bounds.left + 134
        const radius = Math.min(96, Math.abs(left - targetX) / 3)
        const bendY = heading.top - bounds.top - top - 135
        const bendTop = Math.max(0, bendY - radius)
        d = `M ${left} 0 V ${bendTop} C ${left} ${bendTop + radius * .55} ${left - radius * .45} ${bendY} ${left - radius} ${bendY} H ${targetX + radius} C ${targetX + radius * .45} ${bendY} ${targetX} ${bendY + radius * .45} ${targetX} ${bendY + radius}`
      }
      const revealAt = connectionsHeading
        ? connectionsHeading.getBoundingClientRect().top - bounds.top - window.innerHeight * .65
        : Math.max(1, bounds.height - window.innerHeight)
      setGeometry({ page, orbitWidth: ring.width, top, height, width: bounds.width, revealAt: Math.max(1, revealAt), d, ...samplePath(d) })
    }
    const scheduleMeasure = () => {
      cancelAnimationFrame(measureFrame)
      measureFrame = requestAnimationFrame(measure)
    }
    const observer = new ResizeObserver(scheduleMeasure)
    observer.observe(page); observer.observe(orbit)
    window.addEventListener('resize', scheduleMeasure)
    measure()
    return () => { observer.disconnect(); cancelAnimationFrame(measureFrame); window.removeEventListener('resize', scheduleMeasure) }
  }, [homeRef, zoom])
  const end = useTransform(() => Math.min(geometry?.length ?? 0, (geometry?.length ?? 0) * scrollY.get() / (geometry?.revealAt ?? 1)))
  const solidDash = useTransform(() => `${Math.max(0, end.get() - TIP_FADE_LENGTH)} ${(geometry?.length ?? 0) + 1}`)
  const tipDash = useTransform(() => `${Math.min(TIP_FADE_LENGTH, end.get())} ${(geometry?.length ?? 0) + 1}`)
  const tipOffset = useTransform(() => -Math.max(0, end.get() - TIP_FADE_LENGTH))
  const startPoint = useTransform(() => pointAt(geometry, Math.max(0, end.get() - TIP_FADE_LENGTH)))
  const endPoint = useTransform(() => pointAt(geometry, end.get()))
  const x1 = useTransform(() => startPoint.get().x)
  const y1 = useTransform(() => startPoint.get().y)
  const x2 = useTransform(() => endPoint.get().x)
  const y2 = useTransform(() => endPoint.get().y)
  if (!geometry || !connectors.enabled) return null
  const radius = 0.32 * signals.size * geometry.orbitWidth / 100
  return createPortal(<svg className="og-page-signal-line" aria-hidden="true" width={geometry.width} height={geometry.height} style={{ position: 'absolute', left: 0, top: geometry.top, overflow: 'visible', pointerEvents: 'none', zIndex: 1 }}>
    <defs><motion.linearGradient id={fadeId} gradientUnits="userSpaceOnUse" x1={x1} y1={y1} x2={x2} y2={y2}><stop stopColor="var(--color-neutral-400)" /><stop offset="1" stopColor="var(--color-neutral-400)" stopOpacity="0" /></motion.linearGradient></defs>
    <g fill="none" strokeWidth={connectors.thickness} opacity={strokeOpacity ?? connectors.opacity}>
      <motion.path d={geometry.d} stroke="var(--color-neutral-400)" strokeDasharray={solidDash} />
      <motion.path d={geometry.d} stroke={`url(#${fadeId})`} strokeDasharray={tipDash} strokeDashoffset={tipOffset} />
    </g>
    {signals.enabled && (signals.pageCount ?? 6) > 0 && Array.from({ length: signals.pageCount ?? 6 }, (_, index) => <PageSignalDot key={index} index={index} geometry={geometry} radius={radius} end={end} transition={transition} signals={signals} />)}
  </svg>, geometry.page)
}
