import { useState } from 'react'
import { Button } from '../../components/ui/button'
import { MoviShowcase } from './MoviShowcase'

export default function MoviShowcasePage() {
  const [dark, setDark] = useState(true)
  const [playing, setPlaying] = useState(true)
  const [loop, setLoop] = useState(false)
  const [speed, setSpeed] = useState(1)
  const [run, setRun] = useState(0)
  const [phase, setPhase] = useState('Typing your question')
  return <main className={`movi-study${dark ? ' dark' : ''}`}>
    <header className="movi-study-header"><div><h1>Movi showcase</h1><p>Marketing meeting brief · Sample data</p></div><Button variant="outline" onClick={() => setDark(value => !value)}>{dark ? 'Light mode' : 'Dark mode'}</Button></header>
    <div className="movi-study-layout">
      <MoviShowcase key={run} playing={playing} loop={loop} speed={speed} onPhaseChange={setPhase} />
      <aside className="movi-study-controls" aria-label="Animation controls"><h2>Playback</h2><p role="status">{phase}</p><div className="movi-study-actions"><Button onClick={() => setPlaying(value => !value)}>{playing ? 'Pause' : 'Play'}</Button><Button variant="outline" onClick={() => { setRun(value => value + 1); setPlaying(true) }}>Replay</Button></div><label className="movi-speed">Speed <output>{speed}×</output><input type="range" min="0.5" max="2" step="0.25" value={speed} onChange={event => setSpeed(Number(event.target.value))} /></label><label className="movi-loop"><input type="checkbox" checked={loop} onChange={event => setLoop(event.target.checked)} />Loop demo</label><p>Typing → reasoning → streamed response → supporting data.</p></aside>
    </div>
  </main>
}
