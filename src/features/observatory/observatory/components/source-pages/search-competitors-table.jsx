import { useState } from 'react';
import { ChevronDown, ChevronUp } from '@/components/ui/icons';
import { Badge } from '@/components/ui/badge';
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ObservatoryTable } from '../observatory-table';
import { SectionHeading } from '../section-heading';
import { searchCompetitorRows } from '../../data/search-competitors';

export function SearchCompetitorsTable({ lens, account }) {
  const [descending, setDescending] = useState(true);
  const rows = searchCompetitorRows(lens, account)
    .sort((a, b) => (descending ? b.count - a.count : a.count - b.count) || a.name.localeCompare(b.name));
  const SortIcon = descending ? ChevronDown : ChevronUp;

  return <section className="space-y-10" aria-labelledby="search-rankings-heading">
    <SectionHeading id="search-rankings-heading" title="Who shares your search audience" description="Organizations ranked by shared search terms, with tracked competitors distinguished from search overlaps." />
    <ObservatoryTable label="Search rankings" layout="auto">
      <TableHeader><TableRow>
        <TableHead>Organization</TableHead>
        <TableHead>Search type</TableHead>
        <TableHead aria-sort={descending ? 'descending' : 'ascending'}><button type="button" className="flex items-center gap-2 rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ring" onClick={() => setDescending(!descending)}>Shared search terms<SortIcon aria-hidden="true" className="size-4" /></button></TableHead>
        <TableHead>Share</TableHead>
      </TableRow></TableHeader>
      <TableBody>{rows.length ? rows.map(row => <TableRow key={row.name} className="h-12">
        <TableCell className="font-medium"><span className="flex min-w-0 items-center gap-2.5">
          {row.image ? <img src={row.image} alt="" className="size-5 shrink-0 rounded-sm object-contain" /> : <span className="flex size-5 shrink-0 items-center justify-center rounded-sm bg-muted text-sm text-muted-foreground">{row.name.slice(0, 1)}</span>}
          <span className="truncate">{row.name}</span>
        </span></TableCell>
        <TableCell><Badge variant="info" size="lg" className={row.isCompetitor ? 'bg-competitor/15 text-competitor-foreground dark:bg-competitor/20' : undefined}>{row.isCompetitor ? 'Search competitor' : 'Search overlap'}</Badge></TableCell>
        <TableCell>{row.count.toLocaleString('en-US')}</TableCell>
        <TableCell><div className="flex min-w-24 items-center gap-3"><span className="min-w-8 tabular-nums">{row.share.toFixed(0)}%</span><span aria-hidden="true" className="h-1.5 w-20 overflow-hidden rounded-full bg-muted"><span className="block h-full rounded-full bg-foreground" style={{ width: `${row.share}%` }} /></span></div></TableCell>
      </TableRow>) : <TableRow><TableCell colSpan={4} className="text-muted-foreground">No search rankings for this period.</TableCell></TableRow>}</TableBody>
    </ObservatoryTable>
  </section>;
}
