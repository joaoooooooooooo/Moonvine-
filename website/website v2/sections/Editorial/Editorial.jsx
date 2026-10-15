import { WebsiteSection, SectionIntro, WireframeBlock, WIREFRAME_MODE } from '../../components'
import anthropicCover from '../../assets/proto-anthropic.png'
import worldCupCover from '../../assets/proto-worldcup.png'
import taylorCover from '../../assets/proto-taylor.png'

const stories = [
  { image: anthropicCover, title: 'Would the LLMs buy Anthropic stock?' },
  { image: worldCupCover, title: 'The AI consensus on the World Cup' },
  { image: taylorCover, title: 'The prediction market and the Taylor Swift wedding' },
]
export function Editorial() { return <WebsiteSection id="editorial" className="mv-editorial-band" labelledBy="editorial-heading"><SectionIntro id="editorial-heading" title="Specials, insights, and instructionals" description="Research on how brands show up across search, AI, and social, plus practical guides to building better websites and getting more out of Moonvine." /><div className="mv-editorial-grid">{stories.map(({ image, title }) => <article className="mv-editorial-card" key={title}>{WIREFRAME_MODE ? <WireframeBlock label={`${title} cover`} className="mv-editorial-wireframe" /> : <img src={image} alt="" />}<div><h3>{title}</h3></div></article>)}</div></WebsiteSection> }
