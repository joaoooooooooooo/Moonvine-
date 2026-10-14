import { ArrowRight, ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FrameCard, FrameCardContent } from '@/components/ui/frame-card'
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from '@/components/ui/table'
import { StepHeading } from '../components/StepHeading'
import { StepLayout } from '../components/StepLayout'
import { initialCompetitors } from '../review-data'
import { normalizeWebsite } from '../flow-model'

function BrandIcon({ domain, name }) {
  const url = normalizeWebsite(domain)
  const host = url ? new URL(url).hostname.replace(/^www\./, '') : ''
  const known = initialCompetitors.some(item => item.domain === host)
  return known
    ? <img src={`/onboarding-favicons/${host}.png`} alt="" className="size-5 shrink-0 rounded-sm object-contain" />
    : <span aria-hidden="true" className="flex size-5 shrink-0 items-center justify-center rounded-sm bg-muted text-xs">{name.slice(0, 1).toUpperCase()}</span>
}

export function ComparisonScreen({ workspace, competitors, onBack, onContinue }) {
  // Illustrative metrics only. No search results have been collected in this prototype.
  const rivals = competitors.filter(row => normalizeWebsite(row.domain)).map((row, index) => ({ ...row, name: row.name || row.domain, rate: [68, 56, 44, 32, 20][index] ?? 20 }))
  const own = { id: 'workspace', name: workspace.name || 'Your workspace', domain: workspace.website, rate: 12, own: true }
  const rankings = [...rivals, own]
  const metrics = [
    { label: 'Your brand rank', value: `${rankings.length}`, detail: `of ${rankings.length} brands` },
    { label: 'Your mention rate', value: '12.0%', detail: 'Answers that mention your brand' },
    { label: 'Your citation rate', value: '8.0%', detail: 'Answers that cite your website' },
  ]

  return <StepLayout actions={<>
    <Button type="button" variant="ghost" size="lg" onClick={onBack}><ChevronLeft aria-hidden="true" />Back</Button>
    <Button type="button" size="lg" onClick={onContinue}>Improve my visibility<ArrowRight aria-hidden="true" /></Button>
  </>}>
    <StepHeading title="Your AI search snapshot" description="See how your brand compares across the questions you chose." />
    <div className="onboarding-comparison space-y-3">
      <p className="text-sm text-muted-foreground">Sample results</p>
      <div className="onboarding-comparison-grid">
        <div className="onboarding-comparison-metrics">
          {metrics.map(metric => <FrameCard withFill key={metric.label}><FrameCardContent className="gap-2 p-4">
            <h2 className="text-sm font-medium">{metric.label}</h2>
            <div><p className="text-3xl font-medium tabular-nums">{metric.value}</p><p className="mt-1 text-xs text-muted-foreground">{metric.detail}</p></div>
          </FrameCardContent></FrameCard>)}
        </div>
        <FrameCard withFill className="min-w-0"><FrameCardContent className="gap-4 p-4">
          <h2 className="text-sm font-medium">Mention rate rankings</h2>
          <div className="w-full min-w-0">
            <Table aria-label="Mention rate rankings" className="table-fixed">
              <TableHeader className="sr-only"><TableRow><TableHead>Brand</TableHead><TableHead>Mention rate</TableHead></TableRow></TableHeader>
              <TableBody>{rankings.map(row => <TableRow key={row.id} className={row.own ? 'bg-muted/50' : ''}>
                <TableCell className="whitespace-normal"><div className="flex min-w-0 items-center gap-2"><BrandIcon domain={row.domain} name={row.name} /><span className="break-words">{row.name}{row.own && <span className="ml-1 text-xs text-muted-foreground">(you)</span>}</span></div></TableCell>
                <TableCell className="w-20 text-right tabular-nums">{row.rate.toFixed(1)}%</TableCell>
              </TableRow>)}</TableBody>
            </Table>
          </div>
        </FrameCardContent></FrameCard>
      </div>
    </div>
  </StepLayout>
}
