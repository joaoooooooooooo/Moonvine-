import './DemoSurface.css'

export function DemoSurface({ label, children, className = '' }) {
  return <div className={`mv-demo-surface ${className}`}>{label && <div className="mv-demo-label">{label}</div>}{children}</div>
}
