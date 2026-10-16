import { Badge } from '@/components/ui/badge'
import './badge-debug.css'

const variants = ['default', 'outline', 'secondary', 'destructive', 'info', 'success', 'warning', 'error', 'status', 'label']
const sizes = [
  { label: 'Large', value: 'lg' },
  { label: 'Default', value: 'default' },
  { label: 'Small', value: 'sm' },
]

function BadgeBoard({ dark }) {
  return (
    <section className={`badge-debug-board${dark ? ' dark' : ''}`} aria-label={`${dark ? 'Dark' : 'Light'} badge variants`}>
      <div className="badge-debug-board-heading">
        <h2>{dark ? 'Dark' : 'Light'}</h2>
        <p>Theme tokens · badge variants</p>
      </div>
      <div className="badge-debug-scroll">
        <div className="badge-debug-grid">
          <span aria-hidden="true" />
          {variants.map(variant => <span className="badge-debug-column" key={variant}>{variant === 'status' ? 'With status' : variant}</span>)}
          {sizes.map(size => (
            <div className="badge-debug-row" key={size.value}>
              <span className="badge-debug-size">{size.label}</span>
              {variants.map(variant => (
                <div className="badge-debug-cell" key={variant}>
                  {variant === 'status' ? (
                    <Badge size={size.value} variant="label"><span className="badge-debug-dot" aria-hidden="true" />Label</Badge>
                  ) : (
                    <Badge size={size.value} variant={variant}><span aria-hidden="true">×</span>Label<span aria-hidden="true">×</span></Badge>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function BadgeDebug() {
  return (
    <main className="badge-debug-page">
      <header className="badge-debug-intro">
        <h1>Badge tokens</h1>
        <p>All badge variants and sizes, arranged like the Figma component set for visual debugging.</p>
      </header>
      <BadgeBoard dark={false} />
      <BadgeBoard dark />
    </main>
  )
}
