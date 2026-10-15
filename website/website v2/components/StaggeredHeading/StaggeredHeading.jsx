import React from 'react'

export function StaggeredHeading({ as: Tag = 'h2', children, className = '', ...props }) {
  let wordIndex = 0
  const wrapWords = content => React.Children.map(content, child => {
    if (typeof child === 'string' || typeof child === 'number') {
      return String(child).split(/(\s+)/).map(part => !part ? null : /\s/.test(part)
        ? part
        : <span key={wordIndex} className="mv-stagger-word" style={{ '--word-index': Math.min(wordIndex++, 24) }}>{part}</span>)
    }
    if (!React.isValidElement(child) || child.type === 'br') return child
    return React.cloneElement(child, { children: wrapWords(child.props.children) })
  })
  return <Tag {...props} className={`mv-stagger-heading ${className}`.trim()}>{wrapWords(children)}</Tag>
}
