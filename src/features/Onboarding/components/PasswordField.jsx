import { useState } from 'react'
import { EyeIcon, EyeOffIcon } from 'lucide-react'
import { Tooltip, TooltipTrigger, TooltipPopup } from '@/components/ui/tooltip'
import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'

export function PasswordField({ label, name, value, onChange, validate, minLength, autoComplete = 'new-password' }) {
  const [visible, setVisible] = useState(false)
  return <Field name={name} validate={validate}>
    <FieldLabel>{label}</FieldLabel>
    <InputGroup>
      <InputGroupInput type={visible ? 'text' : 'password'} autoComplete={autoComplete} required minLength={minLength} value={value} onChange={event => onChange(event.target.value)} size="lg" />
      <InputGroupAddon align="inline-end">
        <Tooltip>
          <TooltipTrigger render={<Button type="button" variant="ghost" size="icon-xs" aria-label={`${visible ? 'Hide' : 'Show'} ${label.toLowerCase()}`} aria-pressed={visible} onClick={() => setVisible(!visible)} />}>
            {visible ? <EyeOffIcon aria-hidden="true" /> : <EyeIcon aria-hidden="true" />}
          </TooltipTrigger>
          <TooltipPopup>{visible ? 'Hide password' : 'Show password'}</TooltipPopup>
        </Tooltip>
      </InputGroupAddon>
    </InputGroup>
    <FieldError />
  </Field>
}
