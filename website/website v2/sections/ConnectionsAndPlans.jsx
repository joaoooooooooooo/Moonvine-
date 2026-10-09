import React, { useState } from 'react'
import { ArrowRight, ChatCircleDots, ChartLineUp, Check, EnvelopeSimple, Globe, MagnifyingGlass, Megaphone, Sparkle } from '@phosphor-icons/react'
import { Button } from '../../../src/components/ui/button'
import { Badge } from '../../../src/components/ui/badge'
import { FrameCard, FrameCardContent } from '../../../src/components/ui/frame-card'
import { WebsiteSection, SectionIntro, WireframeBlock, WIREFRAME_MODE, APP_URL } from '../components/website-primitives'
import anthropicCover from '../assets/proto-anthropic.png'
import worldCupCover from '../assets/proto-worldcup.png'
import taylorCover from '../assets/proto-taylor.png'

export { Connections } from './Connections'

const steps = [
  { number: '01', title: 'Today', detail: "Start with the domain you want to watch. Explore the dashboard and add sources when you're ready." },
  { number: '02', title: 'Monday', detail: 'Receive a weekly marketing and competitor audit: what changed, why it matters, and what to do next.' },
  { number: '03', title: 'Decision day', detail: 'Review the value during your trial. Keep building the picture or cancel before it ends.' },
]

export function HowItWorks() {
  return <WebsiteSection id="how-it-works" className="mv-how-band" labelledBy="how-heading">
    <SectionIntro id="how-heading" title="No code. No credits. No brainer." description="Start with a domain. Add context over time. Get a clearer read every week." />
    <div className="mv-section-actions">
      <Button render={<a href="#pricing" />} size="xl">Try it free <ArrowRight /></Button>
      <Button render={<a href="#inside" />} variant="outline" size="xl">See what's inside</Button>
    </div>
    <div className="mv-steps">{steps.map(({ number, title, detail }) => <div className="mv-step" key={number}><span className="mv-step-orbit"><span>{number}</span></span><h3>{title}</h3><p>{detail}</p></div>)}</div>
  </WebsiteSection>
}

export function Pricing() {
  const [annual, setAnnual] = useState(false)
  return <WebsiteSection id="pricing" className="mv-pricing-band" labelledBy="pricing-heading"><div className="mv-pricing-grid"><div className="mv-pricing-copy"><p className="mv-kicker">Pricing</p><h2 id="pricing-heading">14 days free, then $249/mo.</h2><p>One place to follow the signals around your brand, read the weekly audit, and work with your data in chat.</p><ul><li><Check size={17} /> Dashboard and chat</li><li><Check size={17} /> Weekly marketing and competitor audit</li><li><Check size={17} /> Connected source coverage</li><li><Check size={17} /> Reports and exports</li></ul></div><FrameCard withFill className="mv-plan"><FrameCardContent><div className="mv-billing-toggle" role="group" aria-label="Billing period"><button type="button" className={!annual ? 'is-active' : ''} aria-pressed={!annual} onClick={() => setAnnual(false)}>Monthly</button><button type="button" className={annual ? 'is-active' : ''} aria-pressed={annual} onClick={() => setAnnual(true)}>Annual <span>2 months free</span></button></div><div className="mv-plan-price"><span>Moonvine Weekly Intelligence</span><strong>{annual ? '$208' : '$249'}<small>/mo</small></strong><p>{annual ? 'Billed $2,490 yearly after your trial' : 'Billed monthly after your 14-day trial'}</p></div><Button render={<a href={APP_URL} />} size="xl">Continue to Moonvine <ArrowRight /></Button><div className="mv-plan-notes"><span>$0 today</span><span>Cancel anytime</span><span>Watch any domain</span></div></FrameCardContent></FrameCard></div></WebsiteSection>
}

const stories = [
  { image: anthropicCover, title: 'Would the LLMs buy Anthropic stock?' },
  { image: worldCupCover, title: 'The AI consensus on the World Cup' },
  { image: taylorCover, title: 'The prediction market and the Taylor Swift wedding' },
]
export function Editorial() { return <WebsiteSection id="editorial" className="mv-editorial-band" labelledBy="editorial-heading"><SectionIntro id="editorial-heading" title="Specials, insights, and instructionals" description="Research on how brands show up across search, AI, and social, plus practical guides to building better websites and getting more out of Moonvine." /><div className="mv-editorial-grid">{stories.map(({ image, title }) => <article className="mv-editorial-card" key={title}>{WIREFRAME_MODE ? <WireframeBlock label={`${title} cover`} className="mv-editorial-wireframe" /> : <img src={image} alt="" />}<div><h3>{title}</h3></div></article>)}</div></WebsiteSection> }



