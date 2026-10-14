import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { StepHeading } from '../components/StepHeading'
import { StepLayout } from '../components/StepLayout'
import { BackToLogin } from '../components/BackToLogin'
import { CircleCheckIcon, ChevronLeft } from '@/components/ui/icons'
import { Separator } from '@/components/ui/separator'

export function CheckEmailScreen({ email, purpose, onChangeEmail, onBack, onResend, magicLink = false }) {
  const [remaining, setRemaining] = useState(30)

  useEffect(() => {
    const timer = window.setInterval(() => setRemaining(value => Math.max(0, value - 1)), 1000)
    return () => window.clearInterval(timer)
  }, [])

  return <StepLayout>
    {magicLink && <div className="flex items-center gap-3">
      <span className="flex size-5 items-center justify-center rounded-full bg-success/15 text-success-foreground"><CircleCheckIcon aria-hidden="true" className="size-3.5" /></span>
      <p className="text-sm text-foreground">Magic link sent</p>
    </div>}
    <StepHeading title="Check your inbox" description={magicLink ? <>We sent a sign-in link to <span className="break-words font-medium text-foreground">{email}</span>. Click it to continue. The link expires in 10 minutes.</> : <>Follow the link in the email to <span className="break-words font-medium text-foreground">{email}</span> to {purpose === 'reset' ? 'reset your password.' : 'confirm your email and create your password.'}</>} />
    <div className="flex flex-col gap-3">
      {magicLink && <Button render={<a href="mailto:" />} size="lg">Open mail app</Button>}
      {!magicLink && <p className="text-sm text-muted-foreground">If the email hasn’t arrived, check your spam folder or request another link.</p>}
      <Button type="button" variant="outline" size="lg" disabled={remaining > 0} onClick={() => { setRemaining(30); onResend() }}>
        {remaining > 0 ? `Resend link in ${remaining}s` : 'Resend link'}
      </Button>

      {magicLink && <Separator className="my-3" />}
      {!magicLink && <Button type="button" variant="ghost" className="self-start" onClick={onChangeEmail}><ChevronLeft aria-hidden="true" />Use a different email</Button>}
      {magicLink && <p className="text-sm text-muted-foreground">Didn’t get the email? Check your spam folder.</p>}
    </div>
    {!magicLink && <BackToLogin onClick={onBack} />}
  </StepLayout>
}
