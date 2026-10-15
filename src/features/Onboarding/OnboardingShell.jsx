import { useThemePreference } from '@/components/navigation/avatar-menu/hooks/use-theme-preference'
import OrbitPlayground from '../orbit-playground/OrbitPlayground'
import wordmark from '@/assets/Logo type - Light.svg'
import './onboarding.css'

/** Shared frame for login and subsequent onboarding steps. */
export function OnboardingShell({ children, step = 0, showProgress = true }) {
  const { resolvedTheme } = useThemePreference()
  const dark = resolvedTheme === 'dark'

  return <div className={`onboarding-page ${dark ? 'dark' : 'light'}`}>
    <div className="onboarding-frame">
      <section className="onboarding-content" aria-label="Get started with Moonvine">
        <header className={`onboarding-header${showProgress ? ' has-progress' : ''}`}>
          <a href="/website" aria-label="Moonvine home" className="rounded-sm focus-visible:outline-2 focus-visible:outline-ring">
            <img src={wordmark} alt="Moonvine" className="onboarding-wordmark" />
          </a>
          {showProgress && <ol className="onboarding-progress" aria-label="Onboarding progress">
            {['Sign in', 'Workspace', 'Competitors', 'Prompts', 'Analysis', 'Comparison'].map((label, index) => <li key={label} aria-current={index === step ? 'step' : undefined}>
              <span className="sr-only">{label}{index < step ? ', complete' : ''}</span>
              <span aria-hidden="true" className={`onboarding-dot${index === step ? ' is-current' : ''}${index < step ? ' is-complete' : ''}`} />
            </li>)}
          </ol>}
        </header>
        <main className="onboarding-step">{children}</main>
      </section>
      <aside className="onboarding-asset" aria-label="Moonvine orbit">
        <OrbitPlayground embedded scrollTransition={false} variant="onboarding" />
      </aside>
    </div>
  </div>
}
