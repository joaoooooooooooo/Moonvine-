import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Moon, Sun } from '@/components/ui/icons'
import { useThemePreference } from '@/components/navigation/avatar-menu/hooks/use-theme-preference'
import { flowScreens } from '../flow-model'

export function FlowPreview({ screen, purpose, onNavigate, onOpenEmail, onReset }) {
  const [open, setOpen] = useState(false)
  const { resolvedTheme, setTheme } = useThemePreference()
  const dark = resolvedTheme === 'dark'
  return <aside className="onboarding-preview" aria-label="Onboarding prototype controls">
    {open && <div id="onboarding-preview-panel" className="rounded-xl border bg-card p-4 shadow-lg">
      <div className="mb-4 space-y-1">
        <h2 className="text-sm font-medium">Flow preview</h2>
        <p className="text-sm text-muted-foreground">Prototype only. No emails are sent and no accounts or passwords are stored. Competitors and prompts are sample data; no website analysis is performed. Analysis and comparison metrics are simulated. Step 5 opens the Observatory.</p>
      </div>
      <div className="flex flex-col gap-2" role="group" aria-label="Preview screen">
        {flowScreens.map(([id, label]) => <Button key={id} type="button" variant={screen === id ? 'secondary' : 'ghost'} className="justify-start" aria-pressed={screen === id} onClick={() => onNavigate(id)}>{label}</Button>)}
      </div>
      <Button type="button" variant="outline" className="mt-4 w-full" onClick={onReset}>Restart flow</Button>
    </div>}
    {screen === 'check-email' && <Button type="button" onClick={onOpenEmail}>Preview {purpose === 'reset' ? 'reset' : 'confirmation'} link</Button>}
    {screen === 'magic-link-sent' && <Button type="button" onClick={onOpenEmail}>Preview sign-in link</Button>}
    <div className="flex items-center gap-2">
      <Button type="button" variant="outline" aria-expanded={open} aria-controls="onboarding-preview-panel" onClick={() => setOpen(!open)}>Flow preview</Button>
      <Button type="button" variant="outline" size="icon" aria-label={dark ? 'Use light theme' : 'Use dark theme'} onClick={() => setTheme(dark ? 'light' : 'dark')}>
        {dark ? <Sun /> : <Moon />}
      </Button>
    </div>
  </aside>
}
