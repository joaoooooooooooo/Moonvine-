import { useState } from 'react';
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ChevronDown, ChevronUp, FileText } from '@/components/ui/icons';
import { ObservatoryTable } from '../observatory-table';
import { SectionHeading } from '../section-heading';

export function AnalyticsLandingPages({ rows, account }) {
  const [descending, setDescending] = useState(true);
  const sorted = [...rows].sort((a, b) => descending ? b.visits - a.visits : a.visits - b.visits);
  const SortIcon = descending ? ChevronDown : ChevronUp;
  return <section className="space-y-10" aria-labelledby="analytics-v2-landing">
    <SectionHeading id="analytics-v2-landing" title="Where people landed" description="The first pages people reached, and how often those visits led to engagement." />
    <ObservatoryTable label="Landing page performance" layout="auto">
      <TableHeader><TableRow><TableHead>Landing page</TableHead><TableHead aria-sort={descending ? 'descending' : 'ascending'}><button type="button" className="flex items-center gap-2 rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ring" onClick={() => setDescending(!descending)}>Visits<SortIcon aria-hidden="true" className="size-4" /></button></TableHead><TableHead>Share</TableHead><TableHead>Engagement</TableHead></TableRow></TableHeader>
      <TableBody>{sorted.map((row) => <TableRow key={row.path}><TableCell><a className="inline-flex min-h-9 items-center gap-2 rounded-sm outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring" href={`https://${account.domain}${row.path}`} target="_blank" rel="noreferrer"><FileText aria-hidden="true" weight="regular" className="size-4 shrink-0 text-muted-foreground" />{row.path}<span className="sr-only"> (opens in a new tab)</span></a></TableCell><TableCell>{row.visits.toLocaleString('en-US')}</TableCell><TableCell><div className="flex min-w-24 items-center gap-3"><span className="min-w-8 tabular-nums">{row.share.toFixed(0)}%</span><span aria-hidden="true" className="h-1.5 w-20 overflow-hidden rounded-full bg-muted"><span className="block h-full rounded-full bg-foreground" style={{ width: `${row.share}%` }} /></span></div></TableCell><TableCell>{row.engagement}%</TableCell></TableRow>)}</TableBody>
    </ObservatoryTable>
  </section>;
}
