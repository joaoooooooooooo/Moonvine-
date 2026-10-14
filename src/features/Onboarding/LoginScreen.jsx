import { MailIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Form } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { StepHeading } from './components/StepHeading'
import { StepLayout } from './components/StepLayout'
import { BackToLogin } from './components/BackToLogin'
import { PasswordField } from './components/PasswordField'

export function LoginScreen({ email, onEmailChange, creating = false, onContinue, onProviderSignIn, onResetPassword, onSwitchMode, onMagicLink }) {
  const [password, setPassword] = useState('')
  return <StepLayout>
    <StepHeading title="Welcome, let's put you in orbit" description={creating ? 'Create your account to get started with Moonvine.' : 'Sign in to continue to Moonvine.'} />
    <div>
      <Form id="login-form" className="flex flex-col gap-3" onSubmit={event => {
        event.preventDefault()
        onContinue()
      }}>
        <Field name="email">
          <FieldLabel>Email</FieldLabel>
          <Input type="email" placeholder="you@example.com" autoComplete="email" required size="lg" value={email} onChange={event => onEmailChange(event.target.value)} />
          <FieldError>Please enter a valid email address.</FieldError>
        </Field>
        {!creating && <PasswordField label="Password" name="password" value={password} onChange={setPassword} autoComplete="current-password" />}
        <Button type="submit" size="lg">{creating ? 'Create account' : 'Log in'}</Button>
      </Form>

      <div className="my-6 flex items-center gap-3">
        <Separator className="flex-1" />
        <span className="text-sm text-muted-foreground">or</span>
        <Separator className="flex-1" />
      </div>
      <div className="flex flex-col gap-3">
        <Button type="button" variant="outline" size="lg" onClick={() => onProviderSignIn('google')}>
          <img src="/orbit-logos/google.svg" alt="" className="size-4" />Continue with Google
        </Button>
        <Button type="button" variant="outline" size="lg" onClick={onMagicLink}>
          <MailIcon aria-hidden="true" />Login with a sign-in link
        </Button>
      </div>
      {creating ? <div className="mt-6"><BackToLogin onClick={onSwitchMode} /></div> : <div className="mt-6 flex flex-wrap items-center justify-between gap-x-4 gap-y-2"><p className="flex flex-wrap items-center gap-x-1 text-sm text-muted-foreground">
        New to Moonvine?
        <Button type="button" variant="link" className="h-auto px-1 py-1" onClick={onSwitchMode}>Create an account</Button>
      </p><Button type="button" variant="link" className="px-0" onClick={onResetPassword}>Forgot password?</Button></div>}
    </div>
  </StepLayout>
}
import { useState } from 'react'
