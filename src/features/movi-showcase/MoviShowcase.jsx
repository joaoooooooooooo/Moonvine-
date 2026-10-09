import { MeetingRecap } from './MeetingRecap'
import { intelligenceItems } from '../observatory/_V2/data/intelligence-navigation'
import { accountHref } from '../observatory/_V2/utils/observatory-model'
import StreamingText from './StreamingText'
import { useEffect, useRef, useState } from 'react'
import { animate, motion, useInView, useMotionValue, useReducedMotion, useTransform } from 'motion/react'
import { ChatMessage } from '../observatory/_V2/components/intelligence-chat/chat-message'
import { ChatComposer } from '../observatory/_V2/components/intelligence-chat/chat-composer'
import { Message, MessageContent } from '../../components/agents/message'
import { ReasoningText } from '../../components/agents/loading-states/reasoning-text'
import { ScrollArea } from '../../components/ui/scroll-area'
import { meetingTurns } from './meeting-scenario'
import './movi-showcase.css'

const reasoningDuration = 3600
const sourceDetails = ['source:gsc', 'source:social', 'source:ga4'].map(lens => {
  const tab = intelligenceItems.find(item => item.lens === lens)
  return { name: tab.label, domain: lens, href: '/observatory-v2' + accountHref('northstar', lens), icon: tab.icon, image: '' }
})

export function MoviShowcase({ playing = true, speed = 1, loop = false, autoAdvance = false, onFirstQuestionSent, onPhaseChange }) {
  const reduced = useReducedMotion()
  const [turnIndex, setTurnIndex] = useState(0)
  const [elapsed, setElapsed] = useState(0)
  const [streamDone, setStreamDone] = useState(false)
  const [streamRun, setStreamRun] = useState(0)
  const [feedback, setFeedback] = useState('')
  const root = useRef(null)
  const inView = useInView(root, { amount: 0.5, once: false })
  const [introDone, setIntroDone] = useState(false)
  const [height, setHeight] = useState(620)
  const entrance = useMotionValue(0)
  const entranceAnimation = useRef(null)
  const entranceY = useTransform(entrance, value => (1 - value) * (-height / 2 + 58))
  const entranceScale = useTransform(entrance, [0, 1], [1.1, 1])
  const composerInset = useTransform(entrance, [0, 1], ['5%', '0%'])
  const composerRadius = useTransform(entrance, [0, 1], ['24px', '48px'])
  const promptFontSize = useTransform(entrance, [0, 1], ['24px', '16px'])
  const turn = meetingTurns[turnIndex]
  const typingEndsAt = 600 + turn.prompt.length * 42
  const typed = elapsed >= typingEndsAt
  const sendAt = typingEndsAt + 350
  useEffect(() => {
    const observer = new ResizeObserver(entries => setHeight(entries[0].contentRect.height))
    if (root.current) observer.observe(root.current)
    return () => observer.disconnect()
  }, [])
  useEffect(() => {
    if (!inView || introDone || (!typed && !reduced)) return
    if (reduced) { entrance.set(1); setIntroDone(true); return }
    const animation = animate(entrance, 1, { duration: 0.85 / speed, delay: 0.15 / speed, ease: [0.22, 1, 0.36, 1] })
    entranceAnimation.current = animation
    let active = true
    animation.then(() => { if (active) setIntroDone(true) })
    return () => { active = false; animation.stop() }
  }, [inView, introDone, typed, reduced, entrance])
  useEffect(() => {
    if (playing && inView) entranceAnimation.current?.play()
    else entranceAnimation.current?.pause()
  }, [playing, inView, typed])
  const answerAt = sendAt + reasoningDuration
  const sent = reduced || elapsed >= sendAt
  const answering = reduced || elapsed >= answerAt
  const finished = reduced || streamDone
  useEffect(() => {
    if (turnIndex === 0 && sent) onFirstQuestionSent?.()
  }, [turnIndex, sent, onFirstQuestionSent])
  const finalTurn = turnIndex === meetingTurns.length - 1
  const phase = !introDone && typed && !reduced ? 'Positioning the composer' : !sent ? 'Typing your question' : !answering ? 'Reviewing the evidence' : !finished ? 'Streaming your meeting brief' : finalTurn ? 'Meeting brief ready' : autoAdvance ? 'Preparing the follow-up' : 'Choose a follow-up'

  function nextTurn(immediate = false) {
    setTurnIndex(current => (current + 1) % meetingTurns.length)
    const next = meetingTurns[(turnIndex + 1) % meetingTurns.length]
    setElapsed(immediate ? 600 + next.prompt.length * 42 + 350 : 0); setStreamDone(false); setStreamRun(0); setFeedback('')
  }
  useEffect(() => {
    if (!inView || !playing || reduced || (finished && (!autoAdvance || (finalTurn && !loop)))) return
    const timer = window.setInterval(() => {
      if (document.hidden) return
      setElapsed(current => {
        if (!introDone && current >= typingEndsAt) return current
        return current >= answerAt && !streamDone ? current : current + 50 * speed
      })
    }, 50)
    return () => window.clearInterval(timer)
  }, [inView, introDone, typingEndsAt, playing, speed, reduced, streamDone, finalTurn, loop, autoAdvance, answerAt])
  useEffect(() => {
    if (autoAdvance && streamDone && elapsed >= answerAt + (finalTurn ? 6500 : 3200) && (!finalTurn || loop)) nextTurn()
  }, [elapsed, streamDone, answerAt, finalTurn, loop, autoAdvance])
  useEffect(() => { onPhaseChange?.(phase) }, [phase, onPhaseChange])
  useEffect(() => {
    const viewport = root.current?.querySelector('[data-slot="scroll-area-viewport"]')
    if (!viewport) return
    if (turnIndex === 0) {
      if (!sent) viewport.scrollTop = 0
      return
    }
    viewport.scrollTo({ top: viewport.scrollHeight, behavior: reduced ? 'instant' : 'smooth' })
  }, [turnIndex, sent, answering, streamDone, reduced])

  return <section ref={root} className="movi-showcase" aria-label="Movi marketing meeting demo">
    <span className="sr-only" role="status">{phase}</span>
    <ScrollArea className="movi-thread-scroll" overscrollContain scrollFade>
      <div className="movi-thread">

        {meetingTurns.slice(0, turnIndex + 1).map((item, index) => {
          const current = index === turnIndex
          return <div key={index} className="movi-exchange">
            {(!current || sent) && <ChatMessage message={{ from: 'user', text: item.prompt }} />}
            {current && sent && !answering && <Message from="assistant"><MessageContent>{inView && playing ? <ReasoningText variant="swap" phrases={item.reasoning} interval={1200} className="text-base font-normal" /> : <span className="text-base text-muted-foreground">Reviewing the evidence?</span>}</MessageContent></Message>}
            {(!current || answering) && <Message from="assistant"><MessageContent className="w-full max-w-[44ch] gap-3">{current && <p className="movi-reasoned-label">Worked for {reasoningDuration / 1000}s</p>}<div className="movi-read">
              <StreamingText key={current ? streamRun : 'complete'} playing={playing && inView} speed={speed} fill loop={false}
                content={item.content} sources={sourceDetails} showExtras hoverActions={!current} afterContent={item.recap ? <MeetingRecap /> : undefined}
                visibleCount={!current || reduced ? item.content.length : undefined}
                onDone={() => { setStreamDone(true); setElapsed(answerAt) }}
                followUps={current && item.followUp ? [item.followUp] : []} onFollowUp={() => nextTurn(true)}
                onAction={async action => {
                  if (action === 0) { try { await navigator.clipboard.writeText(item.content.filter(token => !token.cite).map(token => token.text).join(' ')); setFeedback('Response copied') } catch { setFeedback('Could not copy the response') } }
                  if (action === 1) { setTurnIndex(index); setStreamRun(value => value + 1); setStreamDone(false); setElapsed(600 + item.prompt.length * 42 + 350 + reasoningDuration); setFeedback('') }
                }} />
            </div>
            </MessageContent></Message>}
          </div>
        })}
        <span className="sr-only" role="status">{feedback}</span>
      </div>
    </ScrollArea>
    <motion.div className="movi-composer-entrance" style={{ y: entranceY, scale: entranceScale, left: composerInset, right: composerInset, '--movi-composer-radius': composerRadius, '--movi-prompt-size': promptFontSize }}>
    <ChatComposer embedded readOnly multiline fullText={turn.prompt} sendPressed={introDone && elapsed >= sendAt - 250 && !sent} value={sent ? '' : turn.prompt.slice(0, Math.max(0, Math.floor((elapsed - 600) / 42)))} onChange={() => {}} onSend={() => setElapsed(sendAt)} isReplying={sent || !typed || !introDone} />
    </motion.div>
  </section>
}
export default MoviShowcase
