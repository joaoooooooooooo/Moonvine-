import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import App from './App.jsx'
import { Observatory } from './features/observatory/observatory'
import { ReportHeroPreview } from '../website/website v2/sections/ReportShowcase/ReportShowcase'
import WebsiteHome from '../website/website v2/main.jsx'
import OrbitPlayground from './features/orbit-playground/OrbitPlayground'
import MoviShowcasePage from './features/movi-showcase/MoviShowcasePage'
import ComponentGallery from './pages/ComponentGallery'
import BadgeDebug from './pages/BadgeDebug'
import ReportHeaderPreview from './pages/ReportHeaderPreview'
import OnboardingPage from './features/Onboarding'
import { Agentation } from 'agentation'

// Observatory is the primary app entry. Normalize the old root/hash entry to it.
const initialPathname = window.location.pathname.replace(/\/$/, '')
if ((initialPathname === '' || initialPathname === '/observatory') && (!window.location.hash || window.location.hash === '#/observatory')) {
  window.history.replaceState(null, '', '/observatory#/console')
}
const pathname = window.location.pathname.replace(/\/$/, '')
const Page = pathname === '/report-header-preview' ? ReportHeaderPreview : pathname === '/onboarding' ? OnboardingPage : pathname === '/website/report-preview' ? ReportHeroPreview : pathname === '/observatory'
  ? Observatory
  : pathname === '/component'
    ? ComponentGallery
  : pathname === '/badge-debug'
    ? BadgeDebug
  : pathname === '/website'
    ? WebsiteHome
    : pathname === '/orbit-playground'
      ? OrbitPlayground
      : pathname === '/movi-showcase'
        ? MoviShowcasePage
        : App

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Page />
    {process.env.NODE_ENV === 'development' && ['/website', '/movi-showcase', '/onboarding'].includes(pathname) && <Agentation />}
  </StrictMode>,
)
