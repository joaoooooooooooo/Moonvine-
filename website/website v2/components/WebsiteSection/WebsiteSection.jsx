import { useSectionReveal } from '../../../../src/hooks/use-section-reveal'
import './WebsiteSection.css'

export function WebsiteSection({
  id,
  className = '',
  children,
  labelledBy,
  reveal = true,
  contentClassName = '',
  contentBorders = true,
  dividerColor,
  backgroundColor,
}) {
  const revealRef = useSectionReveal({ together: true, enterVh: 76 })
  const layoutLabel = id || className.match(/mv-([a-z-]+)-band/)?.[1]?.replaceAll('-', ' ') || 'section'
  return <section id={id} className={`mv-band relative border-b ${className}`} aria-labelledby={labelledBy} data-layout-label={layoutLabel} style={{ ...(dividerColor ? { '--mv-section-line-color': dividerColor } : {}), ...(backgroundColor ? { '--mv-section-background': backgroundColor } : {}) }}>
    <div ref={reveal ? revealRef : undefined} className={`mv-section-inner relative z-10 mx-auto min-w-0 w-[calc(100%-var(--spacing)*8)] max-w-7xl self-stretch overflow-x-clip overflow-y-visible p-20 md:w-[calc(100%-var(--spacing)*12)] ${contentBorders ? 'border-x' : ''} ${contentClassName}`}>
      {children}
    </div>
  </section>
}
