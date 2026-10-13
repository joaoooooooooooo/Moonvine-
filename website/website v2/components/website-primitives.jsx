import React, { useEffect, useState } from 'react'
import { ArrowRight, List, X } from '@phosphor-icons/react'
import { Button } from '../../../src/components/ui/button'
import { useSectionReveal } from '../../../src/hooks/use-section-reveal'
import wordmark from '../../../src/assets/Logo type - Light.svg'

export const APP_URL = 'https://moonvine-product-design.vercel.app/login'
export const OBSERVATORY_URL = 'https://moonvine-ds.vercel.app/observatory-v2'
export const WIREFRAME_MODE = true
export function WebsiteSection({ id, className = '', children, labelledBy, reveal = true }) {
  const revealRef = useSectionReveal({ together: true, enterVh: 76 })
  return <section id={id} className={`mv-band ${className}`} aria-labelledby={labelledBy}><div ref={reveal ? revealRef : undefined} className="mv-container mv-section-inner">{children}</div></section>
}

export function StaggeredHeading({ as: Tag = 'h2', children, className = '', ...props }) {
  let wordIndex = 0
  const wrapWords = content => React.Children.map(content, child => {
    if (typeof child === 'string' || typeof child === 'number') {
      return String(child).split(/(\s+)/).map(part => !part ? null : /\s/.test(part)
        ? part
        : <span key={wordIndex} className="mv-stagger-word" style={{ '--word-index': Math.min(wordIndex++, 24) }}>{part}</span>)
    }
    if (!React.isValidElement(child) || child.type === 'br') return child
    return React.cloneElement(child, { children: wrapWords(child.props.children) })
  })
  return <Tag {...props} className={`mv-stagger-heading ${className}`.trim()}>{wrapWords(children)}</Tag>
}

export function SectionIntro({ eyebrow, title, description, id, centered = false, aside }) {
  return <div className={`mv-section-intro${centered ? ' is-centered' : ''}`}><div>{eyebrow && <p className="mv-kicker">{eyebrow}</p>}<StaggeredHeading id={id}>{title}</StaggeredHeading></div>{description && <p className="mv-section-description">{description}</p>}{aside}</div>
}

export function DemoSurface({ label, children, className = '' }) {
  return <div className={`mv-demo-surface ${className}`}>{label && <div className="mv-demo-label">{label}</div>}{children}</div>
}

export function WireframeBlock({ label, className = '' }) {
  return <div className={`mv-wireframe-block ${className}`} role="img" aria-label={`${label} placeholder`} />
}

function Wordmark() { return <a className="mv-wordmark" href="#top" aria-label="Moonvine home"><img src={wordmark} alt="Moonvine" /></a> }

function Header() {
  const [open, setOpen] = useState(false)
  return <header className="mv-site-header"><div className="mv-container mv-header-inner"><Wordmark /><nav aria-label="Main navigation" className={`mv-nav${open ? ' is-open' : ''}`}><a href="#inside" onClick={() => setOpen(false)}>What’s inside</a><a href="#connections" onClick={() => setOpen(false)}>Connections</a><a href="#how-it-works" onClick={() => setOpen(false)}>How it works</a><a href="#pricing" onClick={() => setOpen(false)}>Pricing</a></nav><div className="mv-header-actions"><Button render={<a href={APP_URL} />} variant="outline">Sign in</Button><Button render={<a href="#pricing" />}>Start free <ArrowRight /></Button></div><Button className="mv-menu-button" variant="outline" size="icon" onClick={() => setOpen(!open)} aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open}>{open ? <X /> : <List />}</Button></div></header>
}

export function WebsiteShell({ children }) {
  const [debugOpen, setDebugOpen] = useState(false)
  const [theme, setTheme] = useState('dark')
  return <div id="top" className={`mv-website ${theme}${theme === 'light' ? ' is-light' : ''}${WIREFRAME_MODE ? ' is-wireframe' : ''}`}>
      <a className="mv-skip" href="#main">Skip to content</a>
      <div className="mv-page"><Header /><main id="main">{children}</main><footer className="mv-footer"><div className="mv-container mv-footer-inner"><Wordmark /><span>A clearer read on the marketing universe.</span><a href="#top">Back to top ↑</a></div></footer></div>
      <div className="mv-reveal-debug">
        <button type="button" className="mv-reveal-debug-toggle" aria-expanded={debugOpen} onClick={() => setDebugOpen(!debugOpen)}>Theme debug</button>
        {debugOpen && <div className="mv-reveal-debug-panel">
          <div className="mv-debug-theme" role="group" aria-label="Page theme"><span>Theme</span><button type="button" aria-pressed={theme === 'dark'} onClick={() => setTheme('dark')}>Dark</button><button type="button" aria-pressed={theme === 'light'} onClick={() => setTheme('light')}>Light</button></div>
        </div>}
      </div>
    </div>
}
