import { useState } from 'react';
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ChevronDown, ChevronUp } from '@/components/ui/icons';
import { ObservatoryTable } from '../observatory-table';
import { ObservatoryInput } from '../observatory-input';
import { SectionHeading } from '../section-heading';

export function SearchQueries({ rows }) {
  const [query, setQuery] = useState('');
  const [descending, setDescending] = useState(true);
  const filtered = rows.filter((row) => row.query.toLowerCase().includes(query.toLowerCase())).sort((a, b) => descending ? b.clicks - a.clicks : a.clicks - b.clicks);
  const SortIcon = descending ? ChevronDown : ChevronUp;
  return <section className="space-y-10" aria-labelledby="search-queries">
    <SectionHeading id="search-queries" title="What people searched for" description="The queries that put your site in front of people, and the clicks they brought." />
    <div className="space-y-4">
      <ObservatoryInput aria-label="Filter search queries" placeholder="Find a query…" value={query} onChange={(event) => setQuery(event.target.value)} className="max-w-sm" />
      <ObservatoryTable label="Search query performance" layout="auto">
        <TableHeader><TableRow><TableHead>Query</TableHead><TableHead aria-sort={descending ? 'descending' : 'ascending'}><button type="button" className="flex items-center gap-2 rounded-sm focus-visible:outline-2 focus-visible:outline-ring" onClick={() => setDescending(!descending)}>Clicks<SortIcon aria-hidden="true" className="size-4" /></button></TableHead><TableHead>Impressions</TableHead><TableHead>CTR</TableHead><TableHead>Position</TableHead></TableRow></TableHeader>
        <TableBody>{filtered.length ? filtered.map((row) => <TableRow key={row.query}><TableCell className="font-medium">{row.query}</TableCell><TableCell>{row.clicks.toLocaleString('en-US')}</TableCell><TableCell>{row.impressions.toLocaleString('en-US')}</TableCell><TableCell>{row.ctr.toFixed(2)}%</TableCell><TableCell>{row.position.toFixed(1)}</TableCell></TableRow>) : <TableRow><TableCell colSpan={5} className="text-muted-foreground">No queries match your search.</TableCell></TableRow>}</TableBody>
      </ObservatoryTable>
      <p role="status" className="text-sm/normal text-muted-foreground">{filtered.length} of {rows.length} queries</p>
    </div>
  </section>;
}
