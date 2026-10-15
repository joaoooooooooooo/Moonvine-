import { ArrowRight } from '@phosphor-icons/react'
import { Button } from '../../../../src/components/ui/button'
import { WebsiteSection, SectionIntro } from '../../components'

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
