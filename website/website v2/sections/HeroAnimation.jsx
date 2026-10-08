import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'motion/react'
import { Check, Sparkle, ArrowUp } from '@phosphor-icons/react'
import { Button } from '../../../src/components/ui/button'
import { Input } from '../../../src/components/ui/input'
import { Badge } from '../../../src/components/ui/badge'
import { FrameCard, FrameCardContent } from '../../../src/components/ui/frame-card'
import { ChatMessage } from '../../../src/features/observatory/_V2/components/intelligence-chat/chat-message'
import './hero-animation.css'

// Authored cues and interpolation from Moonvine Hero Animation v3.
const C = { Ask: 1.5, Read: 5, Answer: 8, Reset: 17, Total: 19 }
const clamp = value => Math.max(0, Math.min(1, value))
const progress = (t, start, duration) => clamp((t - start) / duration)
const enter = (t, start, duration = .6) => 1 - Math.pow(1 - progress(t, start, duration), 3)
const draw = (t, start, duration = 1) => { const p = progress(t, start, duration); return p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2 }
const pop = (t, start, duration = .5) => { const p = progress(t, start, duration) - 1; return 1 + 2.70158 * p * p * p + 1.70158 * p * p }
const lerp = (a, b, p) => a + (b - a) * p
const question = 'I have a marketing meeting in 10 minutes. Help.'
const title = 'Your 10-minute brief: North Street Creative'
const read = "You're winning on search visibility but losing on social momentum. Competitors are publishing more, and you haven't posted in 30 days."
const quote = "We're prioritizing high-intent vertical landing pages and outcome-driven case studies to blunt competitors' volume advantage."
const sources = ['Google Analytics', 'Search Console', 'AI visibility', 'Competitor social', 'Earned media', 'Site health', 'Trends']
const fragments = [
  ['Sessions', '382', 0, 18], ['Search clicks', '8', 100, 14],
  ['Impressions', '2,900', -2, 48], ['AI mentions', '41 / 75', 101, 43],
  ['Engagement', '40%', 1, 80], ['Competitor posts', '32', 99, 78],
  ['Backlinks', '+412', 42, 98],
]
const metrics = [
  { value: 1640, prefix: '', suffix: '', label: 'Sessions, last 30 days', context: '-4% vs. prior' },
  { value: 41, prefix: '', suffix: ' / 75', label: 'AI answers that name you', context: 'ChatGPT leads with 14' },
  { value: 32, prefix: '0 vs ', suffix: '', label: 'Social posts, you vs. fullyvested', context: 'Your biggest gap' },
]

function Stream({ text, t, start, cps }) {
  const shown = text.slice(0, Math.max(0, Math.floor((t - start) * cps)))
  return <span className="mv-film-stream"><span aria-hidden="true" className="mv-film-reserved">{text}</span><span className="mv-film-stream-text">{shown}{t >= start && shown.length < text.length ? <span aria-hidden="true">▍</span> : null}</span></span>
}

export function HeroAnimation() {
  const root = useRef(null)
  const questionSlot = useRef(null), sourceSlot = useRef(null), metricSlot = useRef(null), quoteSlot = useRef(null)
  const [slots, setSlots] = useState({})
  const [time, setTime] = useState(0)
  const reduce = useReducedMotion()
  const t = reduce ? 16.9 : time

  useEffect(() => {
    if (reduce) return
    let frame, previous = 0, elapsed = 0, rendered = 0, visible = true
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting })
    observer.observe(root.current)
    const tick = now => {
      if (previous && visible && !document.hidden) elapsed += Math.min(now - previous, 100)
      previous = now
      if (now - rendered >= 33 && visible && !document.hidden) { setTime((elapsed / 1000) % C.Total); rendered = now }
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => { cancelAnimationFrame(frame); observer.disconnect() }
  }, [reduce])

  useLayoutEffect(() => {
    const measure = () => {
      const bounds = root.current.getBoundingClientRect()
      const next = { width: bounds.width, height: bounds.height }
      for (const [name, ref] of [['question', questionSlot], ['sources', sourceSlot], ['metrics', metricSlot], ['quote', quoteSlot]]) {
        const rect = ref.current.getBoundingClientRect()
        next[name] = { x: rect.left - bounds.left + rect.width / 2, y: rect.top - bounds.top + rect.height / 2 }
      }
      setSlots(next)
    }
    const observer = new ResizeObserver(measure)
    observer.observe(root.current)
    for (const ref of [questionSlot, sourceSlot, metricSlot, quoteSlot]) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  const lift = (name, amount, scale, grow = 1, dy = 0) => {
    const slot = slots[name]
    return slot ? `translate(${(slots.width * .5 - slot.x) * amount}px, ${(slots.height * .48 + dy - slot.y) * amount}px) scale(${(1 + (scale - 1) * amount) * grow})` : 'none'
  }
  const fade = 1 - enter(t, C.Reset + .2, .7)
  const qIn = pop(t, C.Ask + .05, .55)
  const qLift = 1 - draw(t, C.Ask + 2.5, .8)
  const sIn = pop(t, C.Read + .05, .5)
  const sLift = 1 - draw(t, C.Read + 2.3, .7)
  const mLift = enter(t, C.Answer + 2.9, .4) * (1 - draw(t, C.Answer + 4.4, .7))
  const yLift = enter(t, C.Answer + 5.2, .4) * (1 - draw(t, C.Answer + 8.1, .7))
  const dim = Math.max(t >= C.Ask ? qLift * clamp(qIn) : 0, t >= C.Read ? sLift * clamp(sIn) : 0, mLift, yLift)

  return <div ref={root} className="mv-hero-film" role="group" aria-label="Sample Moonvine chat animation">
    <div className="mv-film-orbit" aria-hidden="true" />
    <div className="mv-film-chat">
      <div className="mv-film-chat-body">
        <div ref={questionSlot} className="mv-film-question mv-film-lift-slot"><div style={{ opacity: t >= C.Ask ? clamp(qIn * 3) * fade : 0, transform: lift('question', qLift, 1.45, lerp(.5, 1, qIn), -30) }}>
          <ChatMessage message={{ from: 'user', text: <Stream text={question} t={t} start={C.Ask + .35} cps={30} /> }} />
        </div></div>

        <div ref={sourceSlot} className="mv-film-lift-slot"><div style={{ opacity: t >= C.Read ? clamp(sIn * 2) * fade : 0, transform: lift('sources', sLift, 1.18, lerp(.6, 1, sIn), 10) }}>
          <FrameCard withFill><FrameCardContent className="mv-film-source-content">
            <span className="text-sm text-muted-foreground">{t >= C.Read + 2.2 ? '7 sources read · 56% claim coverage' : `Reading sources${'.'.repeat(Math.floor(t * 3) % 4)}`}</span>
            <div className="mv-film-source-list">{sources.map((source, index) => {
              const lit = enter(t, C.Read + .4 + index * .25, .3)
              return <Badge key={source} variant={lit > .5 ? 'success' : 'secondary'} size="lg"><Check aria-hidden="true" style={{ opacity: lit }} />{source}</Badge>
            })}</div>
          </FrameCardContent></FrameCard>
        </div></div>

        <div className="mv-film-answer" style={{ opacity: enter(t, C.Answer, .4) * fade }}>
          <div className="mv-film-answer-title"><Sparkle size={20} aria-hidden="true" /><Stream text={title} t={t} start={C.Answer + .1} cps={55} /></div>
          <Badge variant="secondary" size="lg">The read</Badge>
          <ChatMessage message={{ from: 'assistant', text: <Stream text={read} t={t} start={C.Answer + 1} cps={75} /> }} />
        </div>

        <div ref={metricSlot} className="mv-film-lift-slot"><div className="mv-film-metrics" style={{ opacity: fade, transform: lift('metrics', mLift, 1.2) }}>{metrics.map((metric, index) => {
          const start = C.Answer + 3 + index * .3
          const p = pop(t, start, .5)
          const value = Math.round(metric.value * enter(t, start, .9))
          return <FrameCard withFill key={metric.label} style={{ opacity: clamp(p), transform: `scale(${lerp(.85, 1, p)})` }}><FrameCardContent className="mv-film-metric-content"><strong>{metric.prefix}{value.toLocaleString('en-US')}{metric.suffix}</strong><span>{metric.label}</span><span className="text-muted-foreground">{metric.context}</span></FrameCardContent></FrameCard>
        })}</div></div>

        <div ref={quoteSlot} className="mv-film-lift-slot"><div style={{ opacity: enter(t, C.Answer + 5.2, .4) * fade, transform: lift('quote', yLift, 1.15) }}>
          <FrameCard withFill><FrameCardContent className="mv-film-quote-content"><Badge variant="secondary" size="lg">Say this in the room</Badge><p><Stream text={quote} t={t} start={C.Answer + 5.4} cps={50} /></p></FrameCardContent></FrameCard>
        </div></div>
      </div>
      <div className="mv-film-chat-footer"><Input unstyled nativeInput readOnly tabIndex={-1} aria-label="Chat preview composer" placeholder={t >= 4 ? 'Ask a follow-up…' : 'Ask, investigate, compare, or create…'} /><Button disabled size="icon-sm" aria-label="Preview only"><ArrowUp aria-hidden="true" /></Button></div>
      <div className="mv-film-dim" aria-hidden="true" style={{ opacity: .7 * dim }} />
    </div>

    {!reduce && <div className="mv-film-fragments" aria-hidden="true">{fragments.map(([label, value, x, y], index) => {
      const converge = draw(t, C.Read + .2 + index * .12, .9)
      const back = enter(t, C.Reset + .8 + index * .08, .8)
      const phase = t / C.Total * Math.PI * 2
      const dx = Math.sin(phase + index) * 8, dy = Math.cos(phase + index * 1.7) * 8
      const left = back > 0 ? x : lerp(x, 40 + index * 3.3, converge)
      const top = back > 0 ? y : lerp(y, 48, converge)
      const questionDim = enter(t, C.Ask, .3) * (1 - draw(t, C.Ask + 2.5, .8))
      return <FrameCard withFill key={label} className="mv-film-fragment" style={{ left: `${left}%`, top: `${top}%`, opacity: .7 * (back > 0 ? back : 1 - converge) * (1 - .85 * questionDim), transform: `translate(calc(-50% + ${dx}px),calc(-50% + ${dy}px)) scale(${back > 0 ? lerp(.8, 1, back) : lerp(1, .4, converge)})` }}><FrameCardContent className="mv-film-fragment-content"><span>{label}</span><strong>{value}</strong></FrameCardContent></FrameCard>
    })}</div>}
  </div>
}
