import React, { useState } from 'react'
import { ChartLineUp, CheckCircle, FileArrowDown, Globe, Lightbulb, MagnifyingGlass, Megaphone, Sparkle } from '@phosphor-icons/react'
import { Badge } from '../../../src/components/ui/badge'
import { MetricLineChart } from '../../../src/features/observatory/_V2/components/search-clicks-chart'
import { RankItem } from '../../../src/features/Reports/components/rankEntities/components/rankItem'
import { WebsiteSection, SectionIntro, WireframeBlock, WIREFRAME_MODE } from '../components/website-primitives'

const topics = [
  { icon: Lightbulb, title: 'This week’s headlines', description: 'The most important changes, explained in plain language and ranked by impact.' },
  { icon: ChartLineUp, title: 'Key metrics', description: 'Compare visits, search activity, and engagement with the previous week.' },
  { icon: MagnifyingGlass, title: 'Competitor tracking', description: 'See which organizations are drawing attention around your category.' },
  { icon: Megaphone, title: 'Social monitoring', description: 'Follow owned posts and competitor momentum across connected channels.' },
  { icon: Globe, title: 'Website health', description: 'Find technical and content issues affecting how your site is discovered.' },
  { icon: Sparkle, title: 'AIO + SEO findability', description: 'Understand your presence in search results and AI generated answers.' },
  { icon: CheckCircle, title: 'Cross-intelligence signals', description: 'Connect changes across sources instead of reading each metric alone.' },
  { icon: FileArrowDown, title: 'Technical appendix + export', description: 'Keep the details close and take your evidence with you.' },
]
const series = [
  { day: 'Mon', current: 52, previous: 43 }, { day: 'Tue', current: 61, previous: 49 },
  { day: 'Wed', current: 58, previous: 51 }, { day: 'Thu', current: 74, previous: 55 },
  { day: 'Fri', current: 69, previous: 61 }, { day: 'Sat', current: 80, previous: 63 },
  { day: 'Sun', current: 87, previous: 68 },
]

function Evidence({ index }) {
  if (WIREFRAME_MODE) return <WireframeBlock label={`${topics[index].title} report preview`} className="mv-inside-wireframe" />
  if (index === 1 || index === 3) return <MetricLineChart compact title={index === 1 ? 'Visits' : 'Social engagement'} metricLabel={index === 1 ? 'website visits' : 'interactions'} icon={index === 1 ? ChartLineUp : Megaphone} data={series} />
  if (index === 2 || index === 5) return <ul className="mv-inside-ranks"><RankItem label={index === 2 ? 'Your brand' : 'AI answers mentioning you'} value={34} valueLabel="mentions" fillPercentage={78} percentageLabel="42%" /><RankItem label={index === 2 ? 'Category leader' : 'Cited sources'} value={27} valueLabel="mentions" fillPercentage={61} percentageLabel="33%" /></ul>
  return <div className="mv-inside-example"><span className="mv-inside-example-icon">{React.createElement(topics[index].icon, { size: 26, weight: 'regular' })}</span><div><span className="mv-kicker">From your weekly read</span><strong>{index === 0 ? 'Discovery is growing. Keep an eye on engagement.' : index === 4 ? 'Website checks highlight the pages to review first.' : index === 6 ? 'Search and AI visibility moved together this week.' : 'Keep the full evidence behind each recommendation.'}</strong><p>{topics[index].description}</p></div></div>
}

export function Inside() {
  const [active, setActive] = useState(0)
  return <WebsiteSection id="inside" className="mv-inside-band" labelledBy="inside-title"><SectionIntro id="inside-title" title={<>Every signal, read every week. <span>Made to make sense, with a clear place to put your effort.</span></>} />{WIREFRAME_MODE ? <div className="mv-topic-wireframe" role="group" aria-label="Weekly audit topics">{topics.map((topic, index) => <WireframeBlock key={topic.title} label={topic.title} className={index === 0 ? 'is-active' : ''} />)}</div> : <div className="mv-topic-accordion" aria-label="Weekly audit topics">{topics.map(({ title, description, icon: Icon }, index) => <div key={title} className={`mv-topic-panel${index === active ? ' is-active' : ''}`}><button type="button" className="mv-topic-trigger" aria-expanded={index === active} aria-controls={`mv-topic-content-${index}`} onClick={() => setActive(index)}><span className="mv-topic-number">{String(index + 1).padStart(2, '0')}</span><span className="mv-topic-title">{title}</span><Icon className="mv-topic-trigger-icon" size={21} aria-hidden="true" /></button><div id={`mv-topic-content-${index}`} className="mv-topic-content" hidden={index !== active}><div className="mv-topic-copy"><Badge variant="secondary">Sample data</Badge><h3>{title}</h3><p>{description}</p></div><Evidence index={index} /></div></div>)}</div>}</WebsiteSection>
}
