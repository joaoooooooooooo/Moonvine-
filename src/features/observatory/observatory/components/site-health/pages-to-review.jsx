import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ExternalLink, FileText } from '@/components/ui/icons';
import { ObservatoryCollapsibleTable } from '../observatory-collapsible-table';
import { getSiteFixes } from '../../data/site-fixes';

const pageColumns = [
  {
    id: 'page',
    header: 'Page',
    headerClassName: 'w-1/2',
    cellClassName: 'w-1/2 max-w-0',
    render: (page) => <span className="flex min-w-0 items-center gap-2.5 font-medium text-foreground"><FileText aria-hidden="true" className="size-4 shrink-0" weight="regular" /><span className="min-w-0 truncate">{page.label}</span></span>,
  },
  {
    id: 'issues',
    header: 'Issues',
    headerClassName: 'w-1/2',
    cellClassName: 'w-1/2',
    render: (page) => {
      const issues = page.issues.filter((issue) => issue.severity === 'warning');
      return issues.length ? <span className="flex min-w-0 items-center gap-2"><span aria-hidden="true" className="size-2 shrink-0 rounded-full bg-warning-foreground" /><span className="truncate">{issues[0].title}</span>{issues.length > 1 && <span className="shrink-0 text-muted-foreground">+{issues.length - 1}</span>}</span> : <span className="text-muted-foreground">-</span>;
    },
  },
];

export function PagesToReview({ account }) {
  const pages = getSiteFixes(account.domain);
  const [pageIndex, setPageIndex] = useState(0);
  const pageSize = 10;
  const visiblePages = pages.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize);
  return <section aria-label="Pages to review">
    <ObservatoryCollapsibleTable
      columns={pageColumns}
      getRowId={(page) => account.id + page.path}
      getRowLabel={(page) => page.label}
      label="Pages to review"
      layout="fixed"
      pagination={{ total: pages.length, pageIndex, pageSize, onPageChange: setPageIndex }}
      renderDetails={(page) => <div className="relative before:absolute before:bottom-3 before:left-3 before:top-3 before:w-px before:bg-border/64">
        <ul>{page.issues.map((issue) => <li key={issue.title} className="relative pl-9 last:[&>div]:border-b-0">
          <span aria-hidden="true" className="absolute left-1.5 top-4 size-3 rounded-full bg-warning-foreground" />
          <div className="border-b border-border/64 py-3">
            <h3 className="text-sm/normal font-medium">{issue.title}</h3>
            <p className="mt-1 max-w-[48ch] text-sm/normal text-muted-foreground">{issue.fix}</p>
          </div>
        </li>)}</ul>
        <div className="pl-9 pt-3"><Button render={<a href={page.url} target="_blank" rel="noreferrer" />} size="sm">Check the live page<span className="sr-only"> (opens in a new tab)</span><ExternalLink aria-hidden="true" /></Button></div>
      </div>}
      rows={visiblePages}
      toolbar={<div className="space-y-2">
        <h2 className="max-w-[40rem] font-heading text-3xl font-normal leading-tight tracking-tight text-foreground sm:text-4xl">{pages.some((page) => page.issues.some((issue) => issue.severity === 'warning')) ? 'Some pages need your attention.' : 'No page warnings were found.'}</h2>
        <p className="max-w-[36ch] text-base leading-6 text-muted-foreground">Review affected pages and the fixes saved for each one.</p>
      </div>}
    />
  </section>;
}
