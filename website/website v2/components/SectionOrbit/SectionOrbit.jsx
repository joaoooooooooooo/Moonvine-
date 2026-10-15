import { useEffect, useRef, useState } from 'react'
import RiveOrbit from '../../../../src/components/rive/riveOrbit'
import './SectionOrbit.css'

export function SectionOrbit() {
  const ref = useRef(null)
  const [ready, setReady] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setVisible(entry.isIntersecting)
      if (entry.isIntersecting) setReady(true)
    }, { rootMargin: '300px' })
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return <div ref={ref} className="mv-section-orbit" aria-hidden="true">
    {ready && <RiveOrbit className="mv-section-orbit-art" inheritStrokeColor playing={visible} />}
  </div>
}
