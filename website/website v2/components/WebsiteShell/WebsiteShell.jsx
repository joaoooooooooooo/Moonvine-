import { useState } from 'react'
import { ArrowRight, List, X } from '@phosphor-icons/react'
import { Button } from '../../../../src/components/ui/button'
import { SideLineBackground } from '../../../../src/components/ui/line-background'
import wordmark from '../../../../src/assets/Logo type - Light.svg'
import './WebsiteShell.css'

export const APP_URL = 'https://moonvine-product-design.vercel.app/login'
export const OBSERVATORY_URL = 'https://moonvine-ds.vercel.app/observatory-v2'
export const WIREFRAME_MODE = true

function Wordmark() { return <a className="mv-wordmark" href="#top" aria-label="Moonvine home"><img src={wordmark} alt="Moonvine" /></a> }

function Header() {
  const [open, setOpen] = useState(false)
  return <header className="mv-site-header"><div className="mv-container mv-header-inner"><Wordmark /><nav aria-label="Main navigation" className={`mv-nav${open ? ' is-open' : ''}`}><a href="#inside" onClick={() => setOpen(false)}>What’s inside</a><a href="#connections" onClick={() => setOpen(false)}>Connections</a><a href="#how-it-works" onClick={() => setOpen(false)}>How it works</a><a href="#pricing" onClick={() => setOpen(false)}>Pricing</a></nav><div className="mv-header-actions"><Button render={<a href={APP_URL} />} variant="outline">Sign in</Button><Button render={<a href="#pricing" />}>Start free <ArrowRight /></Button></div><Button className="mv-menu-button" variant="outline" size="icon" onClick={() => setOpen(!open)} aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open}>{open ? <X /> : <List />}</Button></div></header>
}

export function WebsiteShell({ children }) {
  return <div id="top" className={`mv-website dark is-signal-line-hidden is-asset-background-debug${WIREFRAME_MODE ? ' is-wireframe' : ''}`} style={{ '--mv-section-line-color': 'var(--border)', '--mv-page-background': '#212121', '--mv-section-background': '#212121', '--mv-asset-background': '#242424' }}>
      <SideLineBackground variant="small" contentWidth="var(--container-7xl)" className="z-10" style={{ '--border': 'var(--mv-section-line-color)' }} />
      <a className="mv-skip" href="#main">Skip to content</a>
      <div className="mv-page"><Header /><main id="main">{children}</main><footer className="mv-footer"><div className="mv-container mv-footer-inner"><Wordmark /><span>A clearer read on the marketing universe.</span><a href="#top">Back to top ↑</a></div></footer></div>
    </div>
}
