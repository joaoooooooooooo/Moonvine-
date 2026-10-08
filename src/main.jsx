import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import App from './App.jsx'
import { ObservatoryV2 } from './features/observatory/_V2'
import WebsiteHome from '../website/website v2/main.jsx'
import { Agentation } from 'agentation'

// A separate app entry: this recreation never renders the MVDS prototype shell.
if (window.location.hash === '#/observatory-v2') {
  window.history.replaceState(null, '', '/observatory-v2#/console')
}
window.addEventListener('hashchange', () => {
  if (window.location.hash === '#/observatory-v2') {
    window.location.replace('/observatory-v2#/console')
  }
})
const pathname = window.location.pathname.replace(/\/$/, '')
const Page = pathname === '/observatory-v2'
  ? ObservatoryV2
  : pathname === '/website'
    ? WebsiteHome
    : App

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Page />
    {process.env.NODE_ENV === 'development' && pathname === '/website' && <Agentation />}
  </StrictMode>,
)
