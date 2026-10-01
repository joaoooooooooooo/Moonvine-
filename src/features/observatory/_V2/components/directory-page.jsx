import { useState } from 'react';
import { ChevronUp, ChevronDown, ChevronRight, Plus } from 'lucide-react';
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ObservatoryInput as Input } from './observatory-input';
import { Button } from '@/components/ui/button';
import { Empty, EmptyHeader, EmptyTitle, EmptyContent } from '@/components/ui/empty';
import { accounts } from '../data/observatory-fixtures';
import { directorySurfaces } from '../data/navigation';
import { accountHref } from '../utils/observatory-model';
import { PageHeading } from './page-heading';
import { ObservatoryTable } from './observatory-table';

export function DirectoryPage({ type }) {
  const [query, setQuery] = useState('');
  const [ascending, setAscending] = useState(true);
  const [pageIndex, setPageIndex] = useState(0);
  const pageSize = 10;
  const SortIcon = ascending ? ChevronUp : ChevronDown;
  const surface = directorySurfaces.find((item) => item.id === type);
  const rows = type === 'accounts' ? accounts : type === 'people'
    ? accounts.flatMap((account) => Array.from({ length: account.people }, (_, i) => ({ id: account.id + i, name: i === 0 ? 'Jordan Davis' : 'Team member ' + (i + 1), domain: account.name, accountId: account.id })))
    : accounts.flatMap((account) => Array.from({ length: account.entities }, (_, i) => ({ id: account.id + i, name: i === 0 ? account.name : 'Watched organization ' + (i + 1), domain: account.name, accountId: account.id })));
  const filtered = rows.filter((row) => (row.name + ' ' + row.domain).toLowerCase().includes(query.toLowerCase())).sort((a, b) => a.name.localeCompare(b.name) * (ascending ? 1 : -1));
  return (
    <div className="space-y-6 [&>:first-child]:pb-4">
      <PageHeading title={surface.detail} />
      <ObservatoryTable label={surface.label} totalRows={rows.length} pagination={{ total: filtered.length, pageIndex, pageSize, onPageChange: setPageIndex }} toolbar={
          <div className="flex flex-wrap items-center gap-3">
            <Button type="button" variant="default"><Plus aria-hidden="true" />{type === 'accounts' ? 'Add Account' : type === 'people' ? 'Add Person' : 'Add Entity'}</Button>
            {rows.length >= 15 && <div className="w-full max-w-sm"><Input type="search" aria-label={'Search ' + surface.label.toLowerCase()} placeholder={'Search ' + surface.label.toLowerCase()} value={query} onChange={(event) => { setQuery(event.target.value); setPageIndex(0); }} /></div>}
          </div>
      }>
          <TableHeader>
            <TableRow>
              <TableHead aria-sort={ascending ? 'ascending' : 'descending'}><button type="button" className="flex h-full w-full cursor-pointer select-none items-center justify-start gap-2 rounded-sm text-start focus-visible:outline-2 focus-visible:outline-ring" onClick={() => { setAscending(!ascending); setPageIndex(0); }}>{type === 'accounts' ? 'Account' : 'Name'}<SortIcon aria-hidden="true" className="size-4 shrink-0 opacity-80" /></button></TableHead>
              <TableHead className="hidden sm:table-cell">{type === 'accounts' ? 'Domain' : 'Account'}</TableHead>
              {type === 'accounts' && <TableHead className="hidden sm:table-cell">Signal</TableHead>}
              <TableHead className="w-12"><span className="sr-only">Open account</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize).map((row) => (
              <TableRow key={row.id} className="cursor-pointer focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-ring">
                <TableCell className="whitespace-normal">
                  <div className="flex items-center gap-3">
                    <Avatar><AvatarFallback>{row.initials || row.name.split(' ').slice(0, 2).map((part) => part[0]).join('')}</AvatarFallback></Avatar>
                    <div className="min-w-0">
                      {type === 'accounts' ? <a href={accountHref(row.id)} className="relative z-10 font-medium leading-5 underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-ring">{row.name}</a> : <span className="leading-5">{row.name}</span>}
                      <span className="mt-1 block text-xs leading-5 text-muted-foreground sm:hidden">{row.domain}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden text-muted-foreground sm:table-cell">{row.domain}</TableCell>
                {type === 'accounts' && <TableCell className="hidden sm:table-cell"><Badge variant="success">Sources available</Badge></TableCell>}
                <TableCell><a href={accountHref(row.accountId || row.id)} className="inline-flex items-center justify-center text-muted-foreground outline-none after:absolute after:inset-0" aria-label={'Open ' + row.name + ' account'}><ChevronRight aria-hidden="true" className="size-4" /></a></TableCell>
              </TableRow>
            ))}
            {!filtered.length && <TableRow><TableCell colSpan={type === 'accounts' ? 4 : 3}>
              <Empty><EmptyHeader><EmptyTitle className="text-base font-medium">No matching {surface.label.toLowerCase()}.</EmptyTitle></EmptyHeader><EmptyContent><Button variant="secondary" size="sm" onClick={() => setQuery('')}>Clear search</Button></EmptyContent></Empty>
            </TableCell></TableRow>}
          </TableBody>
      </ObservatoryTable>
    </div>
  );
}
