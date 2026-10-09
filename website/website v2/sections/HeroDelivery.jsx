import { useState } from 'react'
import OrbitPlayground from '../../../src/features/orbit-playground/OrbitPlayground'
import { WebsiteSection, APP_URL } from '../components/website-primitives'
import { ProductShowcase } from './ProductShowcase'

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


export function HeroDelivery() {
  return <>
    <WebsiteSection className="mv-hero-band" labelledBy="hero-title">
      <div className="mv-hero-layout">
        <div className="mv-hero-copy">
          <h1 id="hero-title">A weekly audit of your<br />marketing signals,<br />with insights and next<br />steps. Chat native.</h1>
          <p>AIO/GEO, social and competitor intel, earned media, and more via chat, dashboard, and email. Moonvine makes it make sense.</p>
          <DomainScan />
        </div>
        <OrbitPlayground embedded />
      </div>
    </WebsiteSection>
    <ProductShowcase />
  </>
}
