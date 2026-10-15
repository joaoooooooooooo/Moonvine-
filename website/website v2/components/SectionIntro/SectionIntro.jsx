import { StaggeredHeading } from '../StaggeredHeading/StaggeredHeading'
import './SectionIntro.css'

export function SectionIntro({ eyebrow, title, description, id, centered = false, aside }) {
  return <div className={`mv-section-intro${centered ? ' is-centered' : ''}`}><div>{eyebrow && <p className="mv-kicker">{eyebrow}</p>}<StaggeredHeading id={id}>{title}</StaggeredHeading></div>{description && <p className="mv-section-description">{description}</p>}{aside}</div>
}
