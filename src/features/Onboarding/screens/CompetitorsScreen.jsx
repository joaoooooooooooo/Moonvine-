import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CardFrame } from '@/components/ui/card'
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from '@/components/ui/table'
import { Field, FieldLabel, FieldError } from '@/components/ui/field'
import { Form } from '@/components/ui/form'
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from '@/components/ui/input-group'
import { Spinner } from '@/components/ui/spinner'
import { StepHeading } from '../components/StepHeading'
import { StepLayout } from '../components/StepLayout'
import { normalizeWebsite } from '../flow-model'
import { initialCompetitors } from '../review-data'

function CompetitorRow({ row, index, onUpdate }) {
  const [lookup, setLookup] = useState(() => {
    const known = initialCompetitors.find(item => item.domain === row.domain && item.name === row.name)
    return known ? { domain: row.domain, status: 'ready', icon: '/onboarding-favicons/' + known.domain + '.png' } : { domain: '', status: 'idle', icon: '' }
  })
  const nameRef = useRef(row.name)
  nameRef.current = row.name
  const updateRef = useRef(onUpdate)
  useEffect(() => { updateRef.current = onUpdate }, [onUpdate])
  useEffect(() => {
    const preset = initialCompetitors.find(item => item.domain === row.domain && item.name === nameRef.current)
    if (preset) {
      setLookup({ domain: row.domain, status: 'ready', icon: '/onboarding-favicons/' + preset.domain + '.png' })
      return
    }
    setLookup({ domain: '', status: 'idle', icon: '' })
    const url = normalizeWebsite(row.domain)
    if (!url) return
    let cancelled = false
    let request
    let timeout
    const timer = window.setTimeout(() => {
      const host = new URL(url).hostname.replace(/^www\./, '')
      const known = initialCompetitors.find(item => item.domain === host)
      const name = known?.name || host
      const icon = known ? `/onboarding-favicons/${host}.png` : `https://${host}/favicon.ico`
      function finish(success) {
        if (cancelled) return
        cancelled = true
        window.clearTimeout(timeout)
        setLookup({ domain: row.domain, status: success ? 'ready' : 'fallback', icon })
        updateRef.current({ name })
      }
      request = new Image()
      request.referrerPolicy = 'no-referrer'
      request.onload = () => finish(true)
      request.onerror = () => finish(false)
      timeout = window.setTimeout(() => finish(false), 4000)
      request.src = icon
    }, 400)
    return () => {
      cancelled = true
      window.clearTimeout(timer)
      window.clearTimeout(timeout)
      if (request) { request.onload = null; request.onerror = null }
    }
  }, [row.domain])
  const validDomain = normalizeWebsite(row.domain)
  const loading = !!validDomain && lookup.domain !== row.domain
  return <TableRow>
    <TableCell className="whitespace-normal align-middle"><span aria-live="polite" className={row.name ? 'font-medium' : 'text-muted-foreground'}>{row.name || (loading ? 'Looking up competitor…' : '—')}</span></TableCell>
    <TableCell className="align-middle">
      <Field name={`domain-${row.id}`} validate={value => value && !normalizeWebsite(value) ? 'Enter a valid domain.' : null}>
        <FieldLabel className="sr-only">Competitor {index + 1} domain</FieldLabel>
        <InputGroup>
          <InputGroupInput placeholder="example.com" className="*:[input]:ps-0!" size="lg" inputMode="url" autoCapitalize="none" spellCheck={false} aria-busy={loading} value={row.domain.replace(/^https?:\/\//i, '')} onChange={event => onUpdate({ domain: event.target.value.replace(/^https?:\/\//i, ''), name: '' })} />
          <InputGroupAddon className="shrink-0 pe-1">
            {loading ? <Spinner aria-label={`Looking up competitor ${index + 1}`} className="size-4" /> : validDomain && lookup.status === 'ready' ? <img src={lookup.icon} alt="" referrerPolicy="no-referrer" className="size-4 rounded-sm object-contain" /> : <span aria-hidden="true" className="flex size-4 items-center justify-center rounded-sm bg-muted text-xs">{row.name?.[0]?.toUpperCase() || '·'}</span>}
            <InputGroupText className="shrink-0">https://</InputGroupText>
          </InputGroupAddon>
        </InputGroup>
        <FieldError />
      </Field>
    </TableCell>
    <TableCell className="align-middle"><Button type="button" variant="ghost" size="icon" disabled={!row.domain} aria-label={`Remove competitor ${row.name || index + 1}`} onClick={() => onUpdate({ name: '', domain: '' })}><Trash2 aria-hidden="true" /></Button></TableCell>
  </TableRow>
}

export function CompetitorsScreen({ competitors, onChange, onBack, onContinue }) {
  const active = competitors.filter(row => row.domain.trim())
  const valid = active.length > 0 && active.every(row => row.name && normalizeWebsite(row.domain))
  const rows = [...competitors, ...Array.from({ length: Math.max(0, 5 - competitors.length) }, (_, index) => ({ id: `empty-${index}`, name: '', domain: '' }))]
  const rowsRef = useRef(rows)
  rowsRef.current = rows
  function update(id, patch) {
    const next = rowsRef.current.map(row => row.id === id ? { ...row, ...patch } : row)
    rowsRef.current = next
    onChange(next)
  }
  return <StepLayout actions={<>
    <Button type="button" variant="ghost" size="lg" onClick={onBack}><ChevronLeft aria-hidden="true" />Back</Button>
    <Button type="submit" form="competitors-form" size="lg" disabled={!valid}>Continue</Button>
  </>}>
    <StepHeading title="Review your competitors" description="Choose the brands to compare with your workspace across AI answers. Add or update their domains before continuing." />
    <Form id="competitors-form" className="onboarding-wide-table" onSubmit={event => { event.preventDefault(); if (valid) onContinue() }}>
      <CardFrame className="rounded-md">
        <Table variant="card" aria-label="Competitors" className="onboarding-data-table table-fixed [&_tbody]:rounded-none! [&_tbody]:shadow-none! [&_tbody]:before:hidden [&_tbody_td]:rounded-none!">
          <TableHeader><TableRow><TableHead className="w-[35%]">Competitors ({active.length}/5)</TableHead><TableHead>Domain</TableHead><TableHead className="w-10"><span className="sr-only">Remove</span></TableHead></TableRow></TableHeader>
          <TableBody>{rows.map((row, index) => <CompetitorRow key={row.id} row={row} index={index} onUpdate={patch => update(row.id, patch)} />)}</TableBody>
        </Table>
      </CardFrame>
    </Form>
  </StepLayout>
}
