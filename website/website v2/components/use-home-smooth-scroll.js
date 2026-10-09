import { useEffect } from 'react'

// Smooth wheel input on the document; nested chat/control scrollers remain native.
export function useHomeSmoothScroll() {
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0
    let target = window.scrollY
    let position = window.scrollY
    let previous = 0
    const stop = () => { cancelAnimationFrame(frame); frame = 0; target = position = window.scrollY }
    const tick = time => {
      const delta = Math.min(64, time - previous)
      previous = time
      target = Math.max(0, Math.min(target, document.documentElement.scrollHeight - window.innerHeight))
      // Integrate an unrounded position so browser pixel rounding cannot stall the tail.
      position += (target - position) * (1 - Math.exp(-delta / 110))
      if (Math.abs(target - position) < 0.5) position = target
      window.scrollTo({ top: position, behavior: 'instant' })
      if (position !== target) frame = requestAnimationFrame(tick)
      else frame = 0
    }
    const wheel = event => {
      if (preference.matches || event.defaultPrevented || event.ctrlKey || event.metaKey || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return
      for (let node = event.target instanceof Element ? event.target : null; node && node !== document.body; node = node.parentElement) {
        if (node.matches('[data-slot="scroll-area-viewport"], textarea, select, [role="dialog"]')) return
        if (/(auto|scroll)/.test(getComputedStyle(node).overflowY) && node.scrollHeight > node.clientHeight) return
      }
      if (!event.deltaY) return
      event.preventDefault()
      if (!frame) target = position = window.scrollY
      const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerHeight : 1
      target = Math.max(0, Math.min(target + event.deltaY * unit, document.documentElement.scrollHeight - window.innerHeight))
      if (!frame) { previous = performance.now(); frame = requestAnimationFrame(tick) }
    }
    window.addEventListener('wheel', wheel, { passive: false })
    window.addEventListener('pointerdown', stop)
    window.addEventListener('keydown', stop)
    preference.addEventListener('change', stop)
    return () => {
      stop()
      window.removeEventListener('wheel', wheel)
      window.removeEventListener('pointerdown', stop)
      window.removeEventListener('keydown', stop)
      preference.removeEventListener('change', stop)
    }
  }, [])
}
