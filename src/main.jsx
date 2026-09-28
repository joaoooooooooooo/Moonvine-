import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import App from './App.jsx'
import { ObservatoryV2 } from './features/observatory/_V2'

// A separate app entry: this recreation never renders the MVDS prototype shell.
if (window.location.hash === '#/observatory-v2') {
  window.history.replaceState(null, '', '/observatory-v2#/console')
}
window.addEventListener('hashchange', () => {
  if (window.location.hash === '#/observatory-v2') {
    window.location.replace('/observatory-v2#/console')
  }
})
const Page = window.location.pathname.replace(/\/$/, '') === '/observatory-v2'
  ? ObservatoryV2
  : App

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Page />
  </StrictMode>,
)
