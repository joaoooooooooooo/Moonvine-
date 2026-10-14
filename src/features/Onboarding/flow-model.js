export const flowScreens = [
  ['login', 'Sign in'],
  ['magic-link', 'Sign in with a link'],
  ['magic-link-sent', 'Magic link sent'],
  ['create-account', 'Create account'],
  ['reset-password', 'Reset password'],
  ['check-email', 'Check your inbox'],
  ['new-password', 'Create password'],
  ['workspace', 'Step 1 · Workspace'],
  ['competitors', 'Step 2 · Competitors'],
  ['prompts', 'Step 3 · Initial prompts'],
  ['analysis', 'Step 4 - Analysis'],
  ['comparison', 'Step 5 - Comparison'],
]

export function readFlowScreen() {
  const screen = window.location.hash.replace(/^#\/?/, '')
  return flowScreens.some(([id]) => id === screen) ? screen : 'login'
}

export function normalizeWebsite(value) {
  const trimmed = value.trim()
  if (!trimmed || /\s/.test(trimmed)) return null
  try {
    const url = new URL(/^[a-z][a-z\d+.-]*:/i.test(trimmed) ? trimmed : `https://${trimmed}`)
    if (!['https:', 'http:'].includes(url.protocol) || !url.hostname.includes('.') || url.username || url.password) return null
    return url.href
  } catch {
    return null
  }
}
