import { coverageHeadline } from '../../data/section-insights';
import { Button } from '@/components/ui/button';
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ObservatoryTable } from '../observatory-table';
import { SectionHeading } from '../section-heading';

export function NewsWatchlist({ rows }) {
  return <section aria-labelledby="news-watchlist" className="space-y-10">
    <SectionHeading id="news-watchlist" title={coverageHeadline(rows.filter((row) => Number(row.matches) > 0).length, rows.length, { all: 'Every watched topic has coverage.', most: 'Most watched topics have coverage.', some: 'Some watched topics have no coverage.', none: 'Your watchlist has no matching stories.', empty: 'Your news watchlist is empty.' })} description="The organization, competitors, and topics checked for this report week." />
    <div className="space-y-4">
      <ObservatoryTable label="News watchlist checks" layout="auto"><TableHeader><TableRow><TableHead>Watching</TableHead><TableHead>Type</TableHead><TableHead>Matched stories</TableHead></TableRow></TableHeader><TableBody>{rows.map((row) => <TableRow key={row.id}><TableCell className="whitespace-normal font-medium">{row.label}</TableCell><TableCell className="text-muted-foreground">{row.type}</TableCell><TableCell><span className="inline-flex items-center gap-2"><span aria-hidden="true" className={`size-2 shrink-0 rounded-full ${row.matches ? 'bg-info-foreground' : 'bg-muted-foreground/40'}`} />{row.matches || 'No matches'}</span></TableCell></TableRow>)}</TableBody></ObservatoryTable>
      <Button variant="secondary" render={<a href="#/console/data-sources/news-keywords" />}>Manage news watchlist</Button>
    </div>
  </section>;
}
