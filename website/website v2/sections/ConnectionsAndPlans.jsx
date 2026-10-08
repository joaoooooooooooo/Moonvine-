import React, { useState } from 'react'
import { ArrowRight, ChatCircleDots, ChartLineUp, Check, EnvelopeSimple, Globe, MagnifyingGlass, Megaphone, Sparkle } from '@phosphor-icons/react'
import { Button } from '../../../src/components/ui/button'
import { Badge } from '../../../src/components/ui/badge'
import { FrameCard, FrameCardContent } from '../../../src/components/ui/frame-card'
import { WebsiteSection, SectionIntro, WireframeBlock, WIREFRAME_MODE, APP_URL } from '../components/website-primitives'
import anthropicCover from '../assets/proto-anthropic.png'
import worldCupCover from '../assets/proto-worldcup.png'
import taylorCover from '../assets/proto-taylor.png'

const sourceGroups = [
  { title: 'Your data', detail: 'First-party', icon: ChartLineUp, items: 'Analytics, Search Console, site health' },
  { title: 'The open web', detail: 'Third-party', icon: Globe, items: 'AI answers, search, earned media' },
  { title: 'Social + rivals', detail: 'Your category', icon: Megaphone, items: 'Channels, competitors, conversations' },
]
const delivery = [
  { title: 'Chat', description: 'Ask anything, get a read', icon: ChatCircleDots },
  { title: 'Dashboard', description: 'Every channel, explained', icon: ChartLineUp },
  { title: 'Weekly email', description: 'The week in your inbox', icon: EnvelopeSimple },
]

const flowPaths = [
  'M340 64 C405 64 405 180 455 180',
  'M340 180 C405 180 405 180 455 180',
  'M340 296 C405 296 405 180 455 180',
  'M545 180 C595 180 595 64 660 64',
  'M545 180 C595 180 595 180 660 180',
  'M545 180 C595 180 595 296 660 296',
]

function FlowConnections() {
  return <svg className="mv-flow-lines" viewBox="0 0 1000 360" preserveAspectRatio="none" aria-hidden="true">
    {flowPaths.map((path, index) => <g key={path}>
      <path className="mv-flow-track" d={path} />
      <path className="mv-flow-signal" d={path} pathLength="100" style={{ animationDelay: `${index * -0.65}s` }} />
      <circle className="mv-flow-dot" r="3.5">
        <animateMotion dur="3.9s" begin={`${index * 0.65}s`} repeatCount="indefinite" path={path} />
      </circle>
    </g>)}
  </svg>
}

export function Connections() { return <WebsiteSection id="connections" className="mv-connections-band" labelledBy="connections-heading"><SectionIntro id="connections-heading" title="Plug and play" description={<><span className="mv-description-line">Moonvine pulls from your analytics, social channels,</span>{' '}<span className="mv-description-line">competitors, and the open web,</span>{' '}<span className="mv-description-line">reads it all together, then</span>{' '}<strong className="mv-description-line">answers through chat, dashboard, and email.</strong></>} /><div className="mv-flow" aria-label="Sources are combined into one read, then delivered in chat, dashboard, and email"><FlowConnections /><div className="mv-flow-column">{sourceGroups.map(({ title, detail, icon: Icon, items }) => <FrameCard key={title} withFill className="mv-flow-card"><FrameCardContent><div className="mv-flow-card-heading"><Icon size={19} /><span>{title}</span><Badge variant="secondary">{detail}</Badge></div><p>{items}</p></FrameCardContent></FrameCard>)}</div><div className="mv-flow-center"><div className="mv-flow-orbit" aria-hidden="true"><Sparkle size={32} /></div></div><div className="mv-flow-column">{delivery.map(({ title, description, icon: Icon }) => <FrameCard key={title} withFill className="mv-flow-card"><FrameCardContent><div className="mv-flow-card-heading"><Icon size={19} /><span>{title}</span></div><p>{description}</p></FrameCardContent></FrameCard>)}</div></div><div className="mv-coverage"><h3>Coverage</h3><div className="mv-coverage-grid">{['AI visibility','Google Analytics','Google Search','News + media','Social media','Competitor intelligence'].map((label, i) => <div key={label}><span className="mv-coverage-icon">{React.createElement([Sparkle,ChartLineUp,MagnifyingGlass,Globe,Megaphone,Globe][i], { size: 22 })}</span><span>{label}</span></div>)}</div></div></WebsiteSection> }

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



