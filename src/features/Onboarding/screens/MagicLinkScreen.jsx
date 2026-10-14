import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Form } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { BackToLogin } from '../components/BackToLogin'
import { StepHeading } from '../components/StepHeading'
import { StepLayout } from '../components/StepLayout'

export function MagicLinkScreen({ email, onEmailChange, onSubmit, onBack }) {
  return <StepLayout>
    <StepHeading title="Sign in with a link" description="Enter your email and we’ll send you a sign-in link." />
    <Form className="flex flex-col gap-3" onSubmit={event => { event.preventDefault(); onSubmit() }}>
      <Field name="email">
        <FieldLabel>Email</FieldLabel>
        <Input type="email" autoComplete="email" placeholder="you@example.com" required size="lg" value={email} onChange={event => onEmailChange(event.target.value)} />
        <FieldError>Please enter a valid email address.</FieldError>
      </Field>
      <Button type="submit" size="lg">Send sign-in link</Button>
    </Form>
    <BackToLogin onClick={onBack} />
  </StepLayout>
}
