import React, { useEffect, useState } from 'react'
import { ArrowRight, List, Moon, Sun, X } from '@phosphor-icons/react'
import { Button } from '../../../src/components/ui/button'
import { useSectionReveal } from '../../../src/hooks/use-section-reveal'
import wordmark from '../../../src/assets/Logo type - Light.svg'

export const APP_URL = 'https://moonvine-product-design.vercel.app/login'
export const OBSERVATORY_URL = 'https://moonvine-ds.vercel.app/observatory-v2'
export const WIREFRAME_MODE = true

export function WebsiteSection({ id, className = '', children, labelledBy }) {
  const revealRef = useSectionReveal()
  return <section id={id} className={`mv-band ${className}`} aria-labelledby={labelledBy}><div ref={revealRef} className="mv-container mv-section-inner">{children}</div></section>
}

export function SectionIntro({ eyebrow, title, description, id, centered = false, aside }) {
  return <div className={`mv-section-intro${centered ? ' is-centered' : ''}`}><div><p className="mv-kicker">{eyebrow}</p><h2 id={id}>{title}</h2></div>{description && <p className="mv-section-description">{description}</p>}{aside}</div>
}

export function DemoSurface({ label, children, className = '' }) {
  return <div className={`mv-demo-surface ${className}`}>{label && <div className="mv-demo-label">{label}</div>}{children}</div>
}

export function WireframeBlock({ label, className = '' }) {
  return <div className={`mv-wireframe-block ${className}`} role="img" aria-label={`${label} placeholder`} />
}

function Wordmark() { return <a className="mv-wordmark" href="#top" aria-label="Moonvine home"><img src={wordmark} alt="Moonvine" /></a> }

function Header({ dark, onThemeChange }) {
  const [open, setOpen] = useState(false)
  return <header className="mv-site-header"><div className="mv-container mv-header-inner"><Wordmark /><nav aria-label="Main navigation" className={`mv-nav${open ? ' is-open' : ''}`}><a href="#inside" onClick={() => setOpen(false)}>What’s inside</a><a href="#connections" onClick={() => setOpen(false)}>Connections</a><a href="#how-it-works" onClick={() => setOpen(false)}>How it works</a><a href="#pricing" onClick={() => setOpen(false)}>Pricing</a></nav><div className="mv-header-actions"><Button variant="ghost" size="icon" onClick={onThemeChange} aria-label={`Switch to ${dark ? 'light' : 'dark'} mode`}>{dark ? <Sun /> : <Moon />}</Button><Button render={<a href={APP_URL} />} variant="outline">Sign in</Button><Button render={<a href="#pricing" />}>Start free <ArrowRight /></Button></div><Button className="mv-menu-button" variant="outline" size="icon" onClick={() => setOpen(!open)} aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open}>{open ? <X /> : <List />}</Button></div></header>
}

export function WebsiteShell({ children }) {
  const [dark, setDark] = useState(true)
  return <div id="top" className={`mv-website${dark ? ' dark' : ''}${WIREFRAME_MODE ? ' is-wireframe' : ''}`}><a className="mv-skip" href="#main">Skip to content</a><div className="mv-page"><Header dark={dark} onThemeChange={() => setDark(!dark)} /><main id="main">{children}</main><footer className="mv-footer"><div className="mv-container mv-footer-inner"><Wordmark /><span>A clearer read on the marketing universe.</span><a href="#top">Back to top ↑</a></div></footer></div></div>
}
