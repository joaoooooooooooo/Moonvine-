export function WireframeBlock({ label, className = '' }) {
  return <div className={`mv-wireframe-block ${className}`} role="img" aria-label={`${label} placeholder`} />
}
