import { useEffect, useState } from 'react'
import { ToastProvider, toastManager } from '@/components/ui/toast'
import { TooltipProvider } from '@/components/ui/tooltip'
import { OnboardingShell } from './OnboardingShell'
import { LoginScreen } from './LoginScreen'
import { FlowPreview } from './components/FlowPreview'
import { ResetPasswordScreen } from './screens/ResetPasswordScreen'
import { CheckEmailScreen } from './screens/CheckEmailScreen'
import { NewPasswordScreen } from './screens/NewPasswordScreen'
import { WorkspaceScreen } from './screens/WorkspaceScreen'
import { MagicLinkScreen } from './screens/MagicLinkScreen'
import { readFlowScreen } from './flow-model'
import { CompetitorsScreen } from './screens/CompetitorsScreen'
import { PromptsScreen } from './screens/PromptsScreen'
import { AnalysisScreen } from './screens/AnalysisScreen'
import { ComparisonScreen } from './screens/ComparisonScreen'
import { initialCompetitors, initialPrompts, promptTopics } from './review-data'

const draftKey = 'moonvine:onboarding-preview'
const emptyDraft = { competitorsVersion: 1, email: '', purpose: 'signup', workspace: { name: '', website: '' }, competitors: initialCompetitors, prompts: initialPrompts }

function readDraft() {
  try {
    const saved = JSON.parse(sessionStorage.getItem(draftKey))
    return {
      competitorsVersion: 1,
      competitors: saved?.competitorsVersion === 1 && Array.isArray(saved?.competitors) && saved.competitors.length > 0 && saved.competitors.length <= 5 && saved.competitors.every(row => row && typeof row.id === 'string' && typeof row.name === 'string' && typeof row.domain === 'string') ? saved.competitors : initialCompetitors,
      prompts: Array.isArray(saved?.prompts) && saved.prompts.length > 0 && saved.prompts.length <= 25 && saved.prompts.every(row => row && typeof row.id === 'string' && typeof row.text === 'string' && promptTopics.some(topic => topic.value === row.topic)) ? saved.prompts : initialPrompts,
      email: typeof saved?.email === 'string' ? saved.email : '',
      purpose: saved?.purpose === 'reset' ? 'reset' : 'signup',
      workspace: { name: typeof saved?.workspace?.name === 'string' ? saved.workspace.name : '', website: typeof saved?.workspace?.website === 'string' ? saved.workspace.website : '' },
    }
  } catch { return emptyDraft }
}

export default function OnboardingPage() {
  const [screen, setScreen] = useState(readFlowScreen)
  const [draft, setDraft] = useState(readDraft)
  const { email, purpose, workspace, competitors, prompts } = draft
  useEffect(() => {
    function sync() { setScreen(readFlowScreen()) }
    window.addEventListener('hashchange', sync)
    return () => window.removeEventListener('hashchange', sync)
  }, [])
  useEffect(() => {
    try { sessionStorage.setItem(draftKey, JSON.stringify(draft)) } catch { /* The preview also works without storage. */ }
  }, [draft])
  useEffect(() => {
    document.querySelector('.onboarding-step h1')?.focus({ preventScroll: true })
  }, [screen])

  function navigate(next) {
    window.location.hash = '/' + next
    setScreen(next)
  }
  function setEmail(value) { setDraft(current => ({ ...current, email: value })) }
  function notifyLinkSent(linkPurpose) {
    toastManager.add({
      title: linkPurpose === 'signin' ? 'Sign-in link sent' : linkPurpose === 'reset' ? 'Password reset link sent' : 'Confirmation link sent',
      description: 'Check your inbox at ' + (email.trim().toLowerCase() || 'you@example.com') + '.',
      type: 'success',
    })
  }
  function requestLink(nextPurpose) {
    setDraft(current => ({ ...current, email: current.email.trim().toLowerCase(), purpose: nextPurpose }))
    navigate(nextPurpose === 'signin' ? 'magic-link-sent' : 'check-email')
    notifyLinkSent(nextPurpose)
  }
  function previewScreen(next) {
    if (['check-email', 'new-password', 'magic-link-sent'].includes(next) && !email) setEmail('you@example.com')
    navigate(next)
  }
  function restart() { setDraft(emptyDraft); navigate('login') }

  let content
  if (screen === 'magic-link') content = <MagicLinkScreen email={email} onEmailChange={setEmail} onSubmit={() => requestLink('signin')} onBack={() => navigate('login')} />
  else if (screen === 'magic-link-sent') content = <CheckEmailScreen key={`magic:${email}`} magicLink onResend={() => notifyLinkSent('signin')} email={email || 'you@example.com'} onChangeEmail={() => navigate('magic-link')} />
  else if (screen === 'reset-password') content = <ResetPasswordScreen email={email} onEmailChange={setEmail} onSubmit={() => requestLink('reset')} onBack={() => navigate('login')} />
  else if (screen === 'check-email') content = <CheckEmailScreen key={`${email}:${purpose}`} email={email || 'you@example.com'} purpose={purpose} onResend={() => notifyLinkSent(purpose)} onChangeEmail={() => navigate(purpose === 'reset' ? 'reset-password' : 'create-account')} onBack={() => navigate('login')} />
  else if (screen === 'new-password') content = <NewPasswordScreen purpose={purpose} onContinue={() => navigate('workspace')} onBack={() => navigate('login')} />
  else if (screen === 'workspace') content = <WorkspaceScreen workspace={workspace} onChange={value => setDraft(current => ({ ...current, workspace: value }))} onSave={value => { setDraft(current => ({ ...current, workspace: value })); navigate('competitors') }} onBack={() => navigate('login')} />
  else if (screen === 'competitors') content = <CompetitorsScreen competitors={competitors} onChange={value => setDraft(current => ({ ...current, competitors: value }))} onBack={() => navigate('workspace')} onContinue={() => navigate('prompts')} />
  else if (screen === 'prompts') content = <PromptsScreen prompts={prompts} onChange={value => setDraft(current => ({ ...current, prompts: value }))} onBack={() => navigate('competitors')} onContinue={() => navigate('analysis')} />
  else if (screen === 'analysis') content = <AnalysisScreen workspace={workspace} onBack={() => navigate('prompts')} onComplete={() => navigate('comparison')} />
  else if (screen === 'comparison') content = <ComparisonScreen workspace={workspace} competitors={competitors} onBack={() => navigate('prompts')} onContinue={() => window.location.assign('/observatory-v2#/console')} />
  else content = <LoginScreen key={screen} creating={screen === 'create-account'} email={email} onEmailChange={setEmail} onContinue={() => screen === 'create-account' ? requestLink('signup') : navigate('workspace')} onMagicLink={() => navigate('magic-link')} onProviderSignIn={() => navigate('workspace')} onResetPassword={() => navigate('reset-password')} onSwitchMode={() => navigate(screen === 'create-account' ? 'login' : 'create-account')} />

  return <ToastProvider position="bottom-left"><TooltipProvider><OnboardingShell step={{ workspace: 1, competitors: 2, prompts: 3, analysis: 4, comparison: 5 }[screen] || 0} showProgress={['workspace', 'competitors', 'prompts', 'analysis', 'comparison'].includes(screen)}>
    {content}
    <FlowPreview screen={screen} purpose={purpose} onNavigate={previewScreen} onOpenEmail={() => navigate(screen === 'magic-link-sent' ? 'workspace' : 'new-password')} onReset={restart} />
  </OnboardingShell></TooltipProvider></ToastProvider>
}
