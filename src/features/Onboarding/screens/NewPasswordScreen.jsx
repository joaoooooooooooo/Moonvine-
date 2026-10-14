import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { PasswordField } from '../components/PasswordField'
import { StepHeading } from '../components/StepHeading'
import { StepLayout } from '../components/StepLayout'
import { BackToLogin } from '../components/BackToLogin'

export function NewPasswordScreen({ purpose, onContinue, onBack }) {
  const [password, setPassword] = useState('')
  const [confirmation, setConfirmation] = useState('')
  return <StepLayout>
    <StepHeading title={purpose === 'reset' ? 'Create a new password' : 'Create your password'} description="Use at least 8 characters to keep your account secure." />
    <Form id="new-password-form" className="flex flex-col gap-3" onSubmit={event => {
      event.preventDefault()
      if (password.length >= 8 && password === confirmation) onContinue()
    }}>
      <PasswordField name="password" label={purpose === 'reset' ? 'New password' : 'Password'} value={password} onChange={setPassword} minLength={8} validate={value => value && value.length < 8 ? 'Use at least 8 characters.' : null} />
      <PasswordField name="confirmPassword" label="Confirm password" value={confirmation} onChange={setConfirmation} validate={value => value && value !== password ? 'Your passwords don’t match.' : null} />
      <Button type="submit" size="lg">{purpose === 'reset' ? 'Update password' : 'Create password'}</Button>
    </Form>
    <BackToLogin onClick={onBack} />
  </StepLayout>
}
