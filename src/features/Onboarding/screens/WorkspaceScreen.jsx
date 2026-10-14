import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Form } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { Popover, PopoverPopup, PopoverTrigger } from '@/components/ui/popover'
import { InfoIcon, ChevronLeft } from '@/components/ui/icons'
import { StepHeading } from '../components/StepHeading'
import { StepLayout } from '../components/StepLayout'
import { normalizeWebsite } from '../flow-model'

export function WorkspaceScreen({ workspace, onChange, onBack, onSave }) {
  function update(key, value) { onChange({ ...workspace, [key]: value }) }
  return <StepLayout actions={<>
    <Button type="button" variant="ghost" size="lg" onClick={onBack}><ChevronLeft aria-hidden="true" />Back</Button>
    <Button type="submit" form="workspace-form" size="lg" disabled={!workspace.name.trim() || !normalizeWebsite(workspace.website)}>Continue</Button>
  </>}>
    <StepHeading title="What are we calling it?" description="You can change this later in settings." />
    <Form id="workspace-form" className="flex flex-col gap-3" onSubmit={event => {
      event.preventDefault()
      const website = normalizeWebsite(workspace.website.replace(/^https?:\/\//i, ''))
      if (!website || !workspace.name.trim()) return
      onSave({ name: workspace.name.trim(), website })
    }}>
      <Field name="workspaceName" validate={value => value && !value.trim() ? 'Enter a workspace name.' : null}>
        <FieldLabel>Workspace name <span aria-hidden="true" className="text-destructive-foreground">*</span></FieldLabel>
        <Input type="text" autoComplete="organization" placeholder="Acme" required maxLength={100} size="lg" value={workspace.name} onChange={event => update('name', event.target.value)} />
        <FieldError />
      </Field>
      <Field name="website" validate={value => value && !normalizeWebsite(value) ? 'Enter a valid website, such as example.com.' : null}>
        <FieldLabel>Website <span aria-hidden="true" className="text-destructive-foreground">*</span></FieldLabel>
        <InputGroup>
          <InputGroupInput className="*:[input]:ps-0!" type="text" inputMode="url" autoComplete="url" autoCapitalize="none" spellCheck={false} placeholder="example.com" required size="lg" value={workspace.website.replace(/^https?:\/\//i, '')} onChange={event => update('website', event.target.value.replace(/^https?:\/\//i, ''))} />
          <InputGroupAddon>https://</InputGroupAddon>
          <InputGroupAddon align="inline-end">
            <Popover>
              <PopoverTrigger openOnHover render={<Button type="button" aria-label="Website information" size="icon-xs" variant="ghost" />}><InfoIcon aria-hidden="true" /></PopoverTrigger>
              <PopoverPopup side="top" tooltipStyle><p>The URL of your website</p></PopoverPopup>
            </Popover>
          </InputGroupAddon>
        </InputGroup>
        <FieldError />
      </Field>
    </Form>
  </StepLayout>
}
