import React, { useEffect } from 'react'
import { useHomeSmoothScroll } from './components/use-home-smooth-scroll'
import { WebsiteShell } from './components/website-primitives'
import { HeroDelivery } from './sections/HeroDelivery'
import { ReportShowcase } from './sections/ReportShowcase'
import { Inside } from './sections/Inside'
import { Connections, HowItWorks, Pricing, Editorial } from './sections/ConnectionsAndPlans'
import '../../src/features/observatory/_V2/components/signals-grid.css'
import './components/website-primitives.css'
import './website.css'

export default function WebsiteHome() {
  useHomeSmoothScroll()
  useEffect(() => {
    document.documentElement.classList.add('mv-home-scroll')
    document.title = 'Moonvine — Weekly marketing intelligence'
    return () => document.documentElement.classList.remove('mv-home-scroll')
  }, [])

  return <WebsiteShell><HeroDelivery /><ReportShowcase /><Inside /><Connections /><HowItWorks /><Pricing /><Editorial /></WebsiteShell>
}
