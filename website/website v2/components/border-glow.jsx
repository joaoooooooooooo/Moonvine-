import './border-glow.css'

export function BorderGlow({ as: Tag = 'div', children, className = '', animated = false, duration = 8, colorFrom = '#ffaa40', colorTo = '#9c40ff', ...props }) {
  return <Tag
    {...props}
    className={`mv-border-glow${animated ? ' is-animated' : ''} ${className}`.trim()}
    style={{ '--glow-from': colorFrom, '--glow-to': colorTo, '--glow-duration': `${duration}s`, ...props.style }}
  >
    <span className="mv-border-glow-halo" aria-hidden="true" />
    <span className="mv-border-glow-edge" aria-hidden="true" />
    <div className="mv-border-glow-inner">{children}</div>
  </Tag>
}
