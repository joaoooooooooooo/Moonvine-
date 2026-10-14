import { CardFrame } from '@/components/ui/card'
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from '@/components/ui/table'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ChevronLeft, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Field, FieldLabel, FieldError } from '@/components/ui/field'
import { Form } from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { StepHeading } from '../components/StepHeading'
import { StepLayout } from '../components/StepLayout'

export function PromptsScreen({ prompts, onChange, onBack, onContinue }) {
  const valid = prompts.length > 0 && prompts.every(row => row.text.trim())
  function update(id, key, value) { onChange(prompts.map(row => row.id === id ? { ...row, [key]: value } : row)) }
  return <StepLayout actions={<>
    <Button type="button" variant="ghost" size="lg" onClick={onBack}><ChevronLeft aria-hidden="true" />Back</Button>
    <Button type="submit" form="prompts-form" size="lg" disabled={!valid}>Continue</Button>
  </>}>
    <StepHeading title="Review your initial prompts" description="Choose the questions you want your brand to appear in. Edit the prompts to match your audience." />
    <Form id="prompts-form" className="onboarding-wide-table flex min-w-0 flex-col gap-3" onSubmit={event => { event.preventDefault(); if (valid) onContinue() }}>
      <CardFrame className="rounded-md">
      <ScrollArea className="h-[min(420px,48svh)]" scrollFade scrollbarGutter overscrollContain>
      <Table variant="card" aria-label="Initial prompts" className="onboarding-data-table onboarding-prompts-table table-fixed [&_tbody]:rounded-none! [&_tbody]:shadow-none! [&_tbody]:before:hidden [&_tbody_td]:rounded-none!">
        <TableHeader><TableRow><TableHead>Prompts ({prompts.length}/25)</TableHead><TableHead className="w-10"><span className="sr-only">Remove</span></TableHead></TableRow></TableHeader>
        <TableBody>
        {prompts.map((row, index) => <TableRow key={row.id}>
          <TableCell className="whitespace-normal align-top"><Field name={`text-${row.id}`}>
            <FieldLabel className="sr-only">Prompt {index + 1}</FieldLabel>
            <Textarea required rows={2} size="sm" value={row.text} onChange={event => update(row.id, 'text', event.target.value)} />
            <FieldError />
          </Field></TableCell>
          <TableCell className="align-top"><Button type="button" variant="ghost" size="icon" disabled={prompts.length === 1} aria-label={`Remove prompt ${index + 1}`} onClick={() => onChange(prompts.filter(item => item.id !== row.id))}><Trash2 aria-hidden="true" /></Button></TableCell>
        </TableRow>)}
        </TableBody></Table>
      </ScrollArea>
      </CardFrame>
    </Form>
  </StepLayout>
}
