import { useState } from 'react';
import { ChevronRight, ChevronUp, ChevronDown } from 'lucide-react';
import { TableHeader, TableHead, TableRow, TableBody, TableCell } from '@/components/ui/table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ObservatoryInput as Input } from './observatory-input';
import { ObservatoryTable } from './observatory-table';
import { ReportPreview } from './report-preview';
import { reports } from '../data/reports';

export function ReportsTable({ account, pageSize = 10, label = 'Reports' }) {
  const [query, setQuery] = useState('');
  const [pageIndex, setPageIndex] = useState(0);
  const [newestFirst, setNewestFirst] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  const rows = reports.filter((report) => !account || report.accountId === account.id).map((report) => account ? { ...report, accountName: account.name } : report);
  const filtered = rows.filter((report) => `${report.name} ${report.accountName}`.toLowerCase().includes(query.toLowerCase()));
  if (!newestFirst) filtered.reverse();
  const SortIcon = newestFirst ? ChevronDown : ChevronUp;
  return (
    <div className="space-y-6">
      <ObservatoryTable label={label} totalRows={rows.length} pagination={{ total: filtered.length, pageIndex, pageSize, onPageChange: setPageIndex }} search={
        <div className="w-full max-w-sm"><Input type="search" aria-label="Search reports" placeholder="Search reports" value={query} onChange={(event) => { setQuery(event.target.value); setPageIndex(0); }} /></div>
      }>
        <TableHeader><TableRow>
          <TableHead aria-sort={newestFirst ? 'descending' : 'ascending'}><button type="button" className="flex h-full w-full cursor-pointer items-center justify-start gap-2 text-start focus-visible:outline-2 focus-visible:outline-ring" onClick={() => { setNewestFirst(!newestFirst); setPageIndex(0); }}>Name<SortIcon aria-hidden="true" className="size-4 opacity-80" /></button></TableHead>
          <TableHead className="hidden sm:table-cell">Account</TableHead>
          <TableHead className="hidden w-28 lg:table-cell">Status</TableHead>
          <TableHead className="w-12"><span className="sr-only">Open report</span></TableHead>
        </TableRow></TableHeader>
        <TableBody>{filtered.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize).map((report) => <TableRow key={report.id} className="cursor-pointer focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-ring">
          <TableCell className="whitespace-normal"><div className="flex items-center gap-3"><Avatar className="sm:hidden"><AvatarFallback>{report.initials}</AvatarFallback></Avatar><div className="min-w-0"><span className="block text-sm leading-5">{report.name}</span><span className="mt-1 block text-xs leading-5 text-muted-foreground sm:hidden">{report.accountName}</span></div></div></TableCell>
          <TableCell className="hidden whitespace-normal text-muted-foreground sm:table-cell"><div className="flex items-center gap-3"><Avatar><AvatarFallback>{report.initials}</AvatarFallback></Avatar><span>{report.accountName}</span></div></TableCell>
          <TableCell className="hidden lg:table-cell"><Badge variant="success">{report.status}</Badge></TableCell>
          <TableCell><button type="button" onClick={() => setSelectedReport(report)} className="inline-flex cursor-pointer items-center justify-center text-muted-foreground outline-none after:absolute after:inset-0" aria-label={`Open ${report.name} for ${report.accountName}`}><ChevronRight aria-hidden="true" className="size-4" /></button></TableCell>
        </TableRow>)}
          {!filtered.length && <TableRow><TableCell colSpan={4} className="h-24 text-center text-muted-foreground">No reports found.</TableCell></TableRow>}
        </TableBody>
      </ObservatoryTable>
      <ReportPreview report={selectedReport} onClose={() => setSelectedReport(null)} />
    </div>
  );
}
