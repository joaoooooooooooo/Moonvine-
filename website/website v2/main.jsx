import React, { useEffect } from 'react'
import { WebsiteShell } from './components/website-primitives'
import { HeroDelivery } from './sections/HeroDelivery'
import { Inside } from './sections/Inside'
import { Connections, HowItWorks, Pricing, Editorial } from './sections/ConnectionsAndPlans'
import '../../src/features/observatory/_V2/components/signals-grid.css'
import './components/website-primitives.css'
import './website.css'

export default function WebsiteHome() {
  useEffect(() => {
    document.title = 'Moonvine — Weekly marketing intelligence'
  }, [])

  return <WebsiteShell><HeroDelivery /><Inside /><Connections /><HowItWorks /><Pricing /><Editorial /></WebsiteShell>
}
