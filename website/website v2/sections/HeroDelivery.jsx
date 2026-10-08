import React, { useEffect, useState } from 'react'
import { ArrowRight, ChatCircleDots, ChartLineUp, EnvelopeSimple, Pause, Play, Sparkle } from '@phosphor-icons/react'
import { Button } from '../../../src/components/ui/button'
import { Badge } from '../../../src/components/ui/badge'
import { MetricLineChart } from '../../../src/features/observatory/_V2/components/search-clicks-chart'
import { WebsiteSection, DemoSurface, WireframeBlock, WIREFRAME_MODE, APP_URL } from '../components/website-primitives'


const steps = [
  { question: 'What changed for my brand this week?', answer: 'Search discovery grew while social engagement softened. Start with the pages behind the new search traffic.' },
  { question: 'Where are competitors gaining ground?', answer: 'Two competitors appeared more often in AI answers about your category. Review the questions and cited sources.' },
  { question: 'What should we do next?', answer: 'Refresh the landing pages with the largest visibility gap, then compare the next weekly read.' },
]
const visits = [
  { day: 'Mon', current: 42, previous: 35 }, { day: 'Tue', current: 49, previous: 38 },
  { day: 'Wed', current: 45, previous: 41 }, { day: 'Thu', current: 61, previous: 44 },
  { day: 'Fri', current: 58, previous: 48 }, { day: 'Sat', current: 67, previous: 51 },
  { day: 'Sun', current: 72, previous: 53 },
]

function OrbitVisual() { return <div className="mv-orbit" aria-hidden="true"><div className="mv-orbit-ring ring-a" /><div className="mv-orbit-ring ring-b" /><div className="mv-orbit-ring ring-c" /><div className="mv-orbit-center"><Sparkle size={34} weight="thin" /></div><span className="mv-orbit-chip chip-a">AI answers</span><span className="mv-orbit-chip chip-b">Search</span><span className="mv-orbit-chip chip-c">Social</span></div> }

function ChatDemo() {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  useEffect(() => { if (paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return; const timer = window.setInterval(() => setIndex(i => (i + 1) % steps.length), 6000); return () => window.clearInterval(timer) }, [paused])
  return <div className="mv-chat-demo"><div className="mv-chat-header"><span><ChatCircleDots size={17} /> Moonvine chat</span><Button variant="ghost" size="icon-sm" aria-label={paused ? 'Play chat demo' : 'Pause chat demo'} onClick={() => setPaused(!paused)}>{paused ? <Play /> : <Pause />}</Button></div><div className="mv-chat-body" key={index}><div className="mv-chat-question">{steps[index].question}</div><div className="mv-chat-answer"><span className="mv-chat-avatar"><Sparkle size={15} /></span><p>{steps[index].answer}</p></div></div><div className="mv-chat-input">Ask about your brand <ArrowRight size={15} /></div></div>
}

function DashboardDemo() { return <div className="mv-dashboard-demo"><div className="mv-dashboard-bar"><span>Observatory / Overview</span><Badge variant="secondary">Sample data</Badge></div><div className="mv-dashboard-body"><h3>Signals & evidence</h3><p>A weekly view across your connected sources.</p><MetricLineChart compact title="Website visits" metricLabel="visits this week" icon={ChartLineUp} data={visits} /></div></div> }

function EmailDemo() { return <div className="mv-email-demo"><div className="mv-email-top"><EnvelopeSimple size={18} /><span>Monday, 8:00 AM</span></div><div className="mv-email-content"><p className="mv-kicker">Moonvine weekly intelligence</p><h3>Your week in view</h3><p>Discovery is growing. Keep an eye on engagement.</p><div className="mv-email-rule" /><Badge variant="success">Weekly picture</Badge><h4>What changed this week</h4><p>Search and AI visibility moved up while social engagement eased. Explore the evidence before choosing the next move.</p><div className="mv-email-rule" /><h4>Sources checked</h4><div className="mv-email-source">AI visibility <Badge variant="success">Connected</Badge></div><div className="mv-email-source">Google Search <Badge variant="success">Connected</Badge></div><div className="mv-email-source">Social media <Badge variant="success">Connected</Badge></div><div className="mv-email-rule" /><h4>Next step</h4><p>Review your highest intent pages and compare the next weekly report.</p></div></div> }

function DomainScan() {
  const [domain, setDomain] = useState('')
  const canSubmit = domain.trim().length > 0

  function handleSubmit(event) {
    event.preventDefault()
    if (canSubmit) window.location.assign(APP_URL)
  }

  return <form className="mv-domain-scan" onSubmit={handleSubmit}>
    <div className="mv-domain-scan-inner">
      <label className="sr-only" htmlFor="mv-scan-domain">Domain to scan</label>
      <input id="mv-scan-domain" type="text" inputMode="url" autoComplete="url" placeholder="Enter a domain" value={domain} onChange={event => setDomain(event.target.value)} />
      <button type="submit" disabled={!canSubmit}>Free scan</button>
    </div>
  </form>
}

export function HeroDelivery() { return <><WebsiteSection className="mv-hero-band" labelledBy="hero-title"><div className="mv-hero-layout"><div className="mv-hero-copy"><h1 id="hero-title"><span>You've got the marketing data.</span> Moonvine makes it talk.</h1><DomainScan /><p>Moonvine reads your analytics, search, social, competitors, and AI visibility, then answers in plain language, with the evidence attached.</p></div></div></WebsiteSection><WebsiteSection className="mv-delivery-band" labelledBy="delivery-title"><h2 id="delivery-title" className="sr-only">Moonvine chat, dashboard, and weekly email previews</h2><div className="mv-delivery-grid"><DemoSurface className="mv-delivery-primary"><div className="mv-delivery-stage">{WIREFRAME_MODE ? <><WireframeBlock label="Chat preview" /><WireframeBlock label="Dashboard preview" /></> : <><ChatDemo /><DashboardDemo /></>}</div></DemoSurface><DemoSurface className="mv-delivery-email">{WIREFRAME_MODE ? <WireframeBlock label="Weekly email preview" className="mv-email-wireframe" /> : <EmailDemo />}</DemoSurface></div></WebsiteSection></> }


