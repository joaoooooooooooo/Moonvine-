import React, { useEffect } from 'react'
import { useHomeSmoothScroll, WebsiteShell } from './components'
import { HeroDelivery } from './sections/HeroDelivery/HeroDelivery'
import { ReportShowcase } from './sections/ReportShowcase/ReportShowcase'
import { Inside } from './sections/Inside/Inside'
import { Connections } from './sections/Connections/Connections'
import { HowItWorks } from './sections/HowItWorks/HowItWorks'
import { Pricing } from './sections/Pricing/Pricing'
import { Editorial } from './sections/Editorial/Editorial'
import '../../src/features/observatory/_V2/components/signals-grid.css'
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
